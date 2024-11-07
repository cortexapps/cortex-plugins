import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  PluginContextLocation,
} from "@cortexapps/plugin-core";

import {
  SimpleTable,
  Box,
  Text,
  Loader,
  usePluginContext,
} from "@cortexapps/plugin-core/components";
import Instructions from "./Instructions";

const parseServiceNowDate = (dateString: string): Date | null => {
  // Regex to match format "MM-dd-yyyy hh:mm AM/PM"
  const customFormatRegex = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2} (AM|PM)$/;

  if (customFormatRegex.test(dateString)) {
    // Custom parsing logic for "MM-dd-yyyy hh:mm AM/PM" format
    const [datePart, timePart, meridiem] = dateString.split(" ");
    const [month, day, year] = datePart.split("-").map(Number);
    let [hours, minutes] = timePart.split(":").map(Number);

    // Adjust hours based on AM/PM
    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;

    // Return parsed Date object
    return new Date(year, month - 1, day, hours, minutes);
  } else {
    // Attempt to parse with native Date constructor
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }
};

const Incidents: React.FC = () => {
  const context = usePluginContext();
  const apiBaseUrl = useMemo(() => context?.apiBaseUrl || "", [context]);
  const entityTag = useMemo(() => context?.entity?.tag || "", [context?.entity]);
  const entityName = useMemo(() => context?.entity?.name || "", [context?.entity]);
  const entityType = useMemo(() => context?.entity?.type || "", [context?.entity]);

  const [entityDefinition, setEntityDefinition] = useState<any>(null);

  const [errorStr, setErrorStr] = useState("");

  // Fetch entity definition when entityTag changes
  useEffect(() => {
    if (!apiBaseUrl) {
      return;
    }
    const getEntityDefinition = async (): Promise<void> => {
      try {
        const response = await fetch(`${apiBaseUrl}/catalog/${entityTag}/openapi`);
        const data = await response.json();
        setEntityDefinition(data);
      } catch (e) {
        setErrorStr("Failed to fetch entity definition");
      }
    };
    void getEntityDefinition();
  }, [entityTag]);

  // Extract ServiceNow sys_id from entity definition when it changes
  const entitySysId = useMemo(() => {
    // Check for custom data field first, then fallback to ServiceNow domain ID
    return entityDefinition?.info?.["x-cortex-custom-data"]?.["servicenow-sys_id"]
      || entityDefinition?.info?.["x-cortex-servicenow"]?.domains?.[0]?.id
      || "";
  }, [entityDefinition]);

  const [posts, setPosts] = React.useState<any[]>([]);

  const [snowUrl, setSnowUrl] = React.useState("");
  const [snowCi, setSnowCi] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(
    context.location === PluginContextLocation.Entity
  );

  // Fetch ServiceNow integration configuration from Cortex entity "servicenow-plugin-config"
  useEffect(() => {
    if (!apiBaseUrl) {
      return;
    }
    const getSnowIntegrationConfig = async (): Promise<void> => {
      setIsLoading(true);
      let newSnowUrl = "";
      if (!newSnowUrl) {
        try {
          const response = await fetch(`${apiBaseUrl}/catalog/servicenow-plugin-config/openapi`);
          const data = await response.json();
          newSnowUrl = data.info["x-cortex-definition"]["servicenow-url"];
        } catch (e) {}
      }
      setSnowUrl(newSnowUrl);
      if (!newSnowUrl) {
        setErrorStr("instructions");
      }
      setIsLoading(false);
    };
    void getSnowIntegrationConfig();
  }, [apiBaseUrl]);

  // Fetch ServiceNow CI sys_id from entity definition or search by name/tag
  // If entitySysId is set, use it directly
  // If entitySysId is not set, search for CI in SNOW by name/tag
  useEffect(() => {
    if (entitySysId) {
      setSnowCi(entitySysId);
      return;
    }
    if (!snowUrl || !entityName || !entityTag) {
      return;
    }
    const searchForCI = async (): Promise<void> => {
      if (!snowUrl || !entityTag) {
        return;
      }

      setIsLoading(true);

      const sysparmQuery = encodeURIComponent(`name=${entityName}^ORname=${entityTag}`);
      const url = `${snowUrl}/api/now/table/cmdb_ci_service?sysparm_query=${sysparmQuery}`;

      try {
        const result = await fetch(url);
        const data = await result.json();
        if (data.result.length > 0) {
          try {
            setSnowCi(data.result[0].sys_id);
          } catch (e) {
            console.error(`Failed to search ${url}`, e);
          }
        }
      } catch (e) {
        console.error("Failed to search for CI", e);
        setSnowCi("");
      }
      setIsLoading(false);
    }
    void searchForCI();
  }, [snowUrl, entityTag, entityName, entitySysId]);

  // Fetch incidents associated to the CI
  useEffect(() => {
    const fetchIncidents = async (): Promise<void> => {
      if (!snowUrl || !snowCi) {
        return;
      }
      setIsLoading(true);
      setPosts([]);
      const sysparmQuery = encodeURIComponent(`cmdb_ci=${snowCi}^ORbusiness_service=${snowCi}^ORaffected_ci=${snowCi}^ORDERBYDESCopened_at`);
      try {
        const result = await fetch(
          `${snowUrl}/api/now/table/incident?sysparm_display_value=true&sysparm_query=${sysparmQuery}&sysparm_limit=50`
        );
        const data = await result.json();
        if ((data?.result instanceof Array) && data.result.length > 0) {
          setPosts(data.result);
        }
      } catch (e) {
        console.error("Failed to fetch incidents", e);
      }
      setIsLoading(false);
    };
    void fetchIncidents();
  }, [snowUrl, snowCi]);

  // Table configuration
  const config = {
    columns: [
      {
        Cell: (incident: any) => {
          const number = incident.number;
          const url = `${snowUrl}/nav_to.do?uri=incident.do?sys_id=${incident.sys_id}`;
          return (
            <Box>
              <Text>
                <a href={url} target="_blank" rel="noreferrer">
                  {number}
                </a>
              </Text>
            </Box>
          );
        },
        // accessor: "number",
        id: "number",
        title: "Number",
        width: "10%",
      },
      {
        Cell: (opened_at: string) => {
          const date = parseServiceNowDate(opened_at);
          return (
            <Box>
              <Text>
                {date ? date.toLocaleString() : opened_at}
              </Text>
            </Box>
          );
        },
        accessor: "opened_at",
        id: "opened_at",
        title: "Opened At",
        width: "20%",
      },
      {
        Cell: (incident: any) => {
          const title = incident.short_description;
          return (
            <Box>
              <Text>
                {title}
              </Text>
            </Box>
          );
        },
        // accessor: "short_description",
        id: "short_description",
        title: "Short Description",
        width: "55%",
      },
      {
        Cell: (state: string) => (
          <Box>
            <Text>{state}</Text>
          </Box>
        ),
        accessor: "state",
        id: "state",
        title: "State",
        width: "15%",
      },
    ],
  };

  if (!snowUrl && errorStr === "instructions") {
    return <Instructions />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (errorStr) {
    return (
      <Box backgroundColor="light" margin={2} padding={3} borderRadius={2}>
        <Text>{errorStr}</Text>
      </Box>
    );
  }

  if (!snowCi) {
    return (
      <Box backgroundColor="light" margin={2} padding={3} borderRadius={2}>
        <Box marginBottom={4}>
          <Text>
            Couldn't find any CI in ServiceNow with the name <b>{entityName}</b> or <b>{entityTag}</b>.
          </Text>
        </Box>
        <Text>
          To manually set a CI, map it in the Cortex ServiceNow integration, or add a custom field to the entity with the key <b>servicenow-sys_id</b> and the value of the sys_id of the CI in ServiceNow.
        </Text>
      </Box>
    );
  }
  if (snowCi && posts.length > 0) {
    return (
      <SimpleTable config={config} items={posts} />
    );
  } else if (snowCi && posts.length === 0) {
    return (
      <Box backgroundColor="light" margin={2} padding={3} borderRadius={2}>
        <Text>We could not find any Incidents associated to this {entityType}</Text>
      </Box>
    );
  } else {
    return (
      <Box backgroundColor="light" margin={2} padding={3} borderRadius={2}>
        <Text>We could not find a match for this Service in ServiceNow</Text>
      </Box>
    );
  }
};

export default Incidents;
