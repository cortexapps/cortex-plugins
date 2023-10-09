import React from "react";
import { PluginContextLocation } from "@cortexapps/plugin-core";
import "../baseStyles.css";
import {
  SimpleTable,
  Box,
  Text,
  Loader,
  usePluginContext,
} from "@cortexapps/plugin-core/components";

const snURL = `https://dev80317.service-now.com`;
// Will use this flag to determine what to return based on if we have a match
// between the Service name in Cortex and a CI in the CMDB
let hasCI: boolean = false;
// Let's track if we have change tickets associated with this CI so we can let the user know
let hasChanges: boolean = false;
const Changes: React.FC = () => {
  const context = usePluginContext();
  const [posts, setPosts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(
    context.location === PluginContextLocation.Entity
  );
  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const cortexService = context.entity!.name as string;
      // url encoding the servicename in case it contains spaces
      const serviceURLName: string = encodeURIComponent(cortexService);
      try {
        // Here we are looking at the cmdb_ci_service table for a Configuration Item (ci) to match the service in Cortex.
        // If you want to use a different table, change the url below
        const ciResult = await fetch(
          `${snURL}/api/now/table/cmdb_ci_service?sysparm_query=name%3D${serviceURLName}`
        );
        const ciJson = await ciResult.json();
        const resultArray = ciJson.result;
        if (resultArray.length > 0) {
          hasCI = true;
          const ciSysid: string = resultArray[0].sys_id.toString();
          //
          // since we found a sys_id now we can look for change tickets
          // Calling the change_requests table using the cmdb_ci_service related field (business_service)
          // If you modified the Url above to use a different table you will also need
          // to modify the url below

          const changesResult = await fetch(
            snURL +
              `/api/now/table/change_request?sysparm_display_value=true&sysparm_query=business_service%3D${ciSysid}`
          );
          const changesJson = await changesResult.json();
          if (changesJson.result.length > 0) {
            hasChanges = true;
            setPosts(changesJson.result);
          }
        }
      } catch (error) { }
      setIsLoading(false);
    };
    void fetchData();
  }, []);
  const config = {
    columns: [
      {
        Cell: (number: string) => (
          <Box>
            <Text>{number}</Text>
          </Box>
        ),
        accessor: "number",
        id: "number",
        title: "Number",
        width: "10%",
      },
      {
        Cell: (title: string) => (
          <Box>
            <Text>{title}</Text>
          </Box>
        ),
        accessor: "short_description",
        id: "short_description",
        title: "Short Description",
        width: "65%",
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
      },
    ],
  };

  if (hasCI && hasChanges) {
    return isLoading ? (
      <Loader />
    ) : (
      <SimpleTable config={config} items={posts} />
    );
  } else if (hasCI && !hasChanges) {
    return isLoading ? (
      <Loader />
    ) : (
      <Box backgroundColor="light" padding={3} borderRadius={2}>
        <Text>
          We could not find any Change Requests associated to this Service
        </Text>
      </Box>
    );
  } else {
    return isLoading ? (
      <Loader />
    ) : (
      <Box backgroundColor="light" padding={3} borderRadius={2}>
        <Text>We could not find a match for this Service in ServiceNow</Text>
      </Box>
    );
  }
};

export default Changes;
