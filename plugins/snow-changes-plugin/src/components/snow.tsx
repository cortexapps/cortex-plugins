import React from "react";
import { CortexApi } from "@cortexapps/plugin-core";
import "../baseStyles.css";
import {
  SimpleTable,
  Box,
  Text,
  usePluginContext,
} from "@cortexapps/plugin-core/components";

const snURL = `https://dev67337.service-now.com`;

const Snow: React.FC = () => {
  const context = usePluginContext();
  const [posts, setPosts] = React.useState<any[]>([]);
  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const cortexService = context.entity!.name as string;
      const serviceURLName: string = encodeURIComponent(cortexService);
      const result = await CortexApi.proxyFetch(
        `${snURL}/api/now/table/cmdb_ci_service?sysparm_query=name%3D${serviceURLName}`
      );
      const resultJson = await result.json();
      const sysId: string = resultJson.result[0].sys_id;
      const iResult = await CortexApi.proxyFetch(
        snURL +
          `/api/now/table/change_request?sysparm_display_value=true&sysparm_query=business_service%3D${sysId}`
      );
      const jResult = await iResult.json();
      setPosts(jResult.result);
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

  return (
    <div className="posts-container">
      <SimpleTable config={config} items={posts} />
    </div>
  );
};

export default Snow;
