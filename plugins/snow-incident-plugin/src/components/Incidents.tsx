import type React from "react";
import { useMemo } from "react";

import {
  SimpleTable,
  Box,
  Text,
  Loader,
  usePluginContext,
} from "@cortexapps/plugin-core/components";

import {
  useEntityDefinition,
  useServiceNowConfig,
  useServiceNowCi,
  useIncidents,
} from "../hooks";

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
  const entityTag = useMemo(
    () => context?.entity?.tag ?? "",
    [context?.entity]
  );
  const entityName = useMemo(
    () => context?.entity?.name ?? "",
    [context?.entity]
  );
  const entityType = useMemo(
    () => context?.entity?.type ?? "",
    [context?.entity]
  );

  const { entityDefinition, errorStr: entityDefinitionErrorStr } =
    useEntityDefinition(apiBaseUrl, entityTag);

  // Extract ServiceNow sys_id from entity definition when it changes
  const entitySysId = useMemo(() => {
    // Check for custom data field first, then fallback to ServiceNow domain ID
    return (
      entityDefinition?.info?.["x-cortex-custom-data"]?.["servicenow-sys_id"] ||
      entityDefinition?.info?.["x-cortex-servicenow"]?.domains?.[0]?.id ||
      ""
    );
  }, [entityDefinition]);

  const {
    snowUrl,
    isLoading: snowConfigIsLoading,
    errorStr: snowConfigErrorStr,
  } = useServiceNowConfig(apiBaseUrl);

  const { snowCi, isLoading: snowCiIsLoading } = useServiceNowCi(
    snowUrl,
    entitySysId,
    entityName,
    entityTag
  );
  const { incidents, isLoading: incidentsIsLoading } = useIncidents(
    snowUrl,
    snowCi
  );

  const isLoading =
    snowConfigIsLoading || snowCiIsLoading || incidentsIsLoading;
  const errorStr = entityDefinitionErrorStr || snowConfigErrorStr;

  // Table configuration
  const config = {
    columns: [
      {
        Cell: (incident: Record<string, any>) => {
          const number: string = incident?.number ?? "";
          const sysId: string = incident?.sys_id ?? "";
          const url = `${snowUrl}/nav_to.do?uri=incident.do?sys_id=${sysId}`;
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
        id: "number",
        title: "Number",
        width: "10%",
      },
      {
        Cell: (openedAt: string) => {
          const date = parseServiceNowDate(openedAt);
          return (
            <Box>
              <Text>{date ? date.toLocaleString() : openedAt}</Text>
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
          const title = incident?.short_description ?? "";
          return (
            <Box>
              <Text>{title}</Text>
            </Box>
          );
        },
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
            Couldn't find any CI in ServiceNow with the name <b>{entityName}</b>{" "}
            or <b>{entityTag}</b>.
          </Text>
        </Box>
        <Text>
          To manually set a CI, map it in the Cortex ServiceNow integration, or
          add a custom field to the entity with the key <b>servicenow-sys_id</b>{" "}
          and the value of the sys_id of the CI in ServiceNow.
        </Text>
      </Box>
    );
  }
  if (snowCi && incidents.length > 0) {
    return <SimpleTable config={config} items={incidents} />;
  } else if (snowCi && incidents.length === 0) {
    return (
      <Box backgroundColor="light" margin={2} padding={3} borderRadius={2}>
        <Text>
          We could not find any Incidents associated to this {entityType}
        </Text>
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
