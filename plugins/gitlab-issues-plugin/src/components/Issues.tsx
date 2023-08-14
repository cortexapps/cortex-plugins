import React from "react";
import { CortexApi } from "@cortexapps/plugin-core";
import {
  SimpleTable,
  Box,
  Text,
  usePluginContext,
} from "@cortexapps/plugin-core/components";
import "../baseStyles.css";

// Set your Gitlab url. Cloud is https://gitlab.com
const glURL = `https://gitlab.com/`;
let hasGitLab: boolean = false;
// function to get Cortex API Basepath
const Issues: React.FC = () => {
  const context = usePluginContext();
  const [posts, setPosts] = React.useState<any[]>([]);
  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const cortexTag = context.entity!.tag;
      const cortexURL = context.apiBaseUrl;
      const result = await fetch(`${cortexURL}/catalog/${cortexTag}/openapi`);
      const resultJson = await result.json();
      if (resultJson.info?.["x-cortex-git"].gitlab.repository !== undefined) {
        hasGitLab = true;
        // If we have a GitHub tag, we assume there is a repo defined, let's get the value
        const glRepo: string =
          resultJson.info["x-cortex-git"].gitlab.repository;
        // const encodedRepo = encodeURI(glRepo);
        const encodedRepo = glRepo.replace("/", "%2F");
        // Let's check if we have a basepath defined, to check for mono repo
        if (resultJson.info["x-cortex-git"].gitlab.basepath !== undefined) {
          // we are going to assume that each service is being tracked via labels
          const url: string = `${glURL}api/v4/projects/${encodedRepo}/issues?labels=${cortexTag}`;
          const iResult = await fetch(url);
          const jResult = await iResult.json();
          setPosts(jResult);
        } else {
          const apiURL = `${glURL}api/v4/projects/${encodedRepo}/issues`;
          const iResult = await CortexApi.proxyFetch(apiURL);
          const jResult = await iResult.json();
          setPosts(jResult);
        }
      }
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
        accessor: "iid",
        id: "iid",
        title: "Number",
        width: "10%",
      },
      {
        Cell: (title: string) => (
          <Box>
            <Text>{title}</Text>
          </Box>
        ),
        accessor: "title",
        id: "title",
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

  if (hasGitLab) {
    return <SimpleTable config={config} items={posts} />;
  } else {
    return (
      <Box backgroundColor="light" padding={3} borderRadius={2}>
        <Text>
          This service does not have a GitLab Repo defined in the Service YAML
          or the GitLab Access Token does not have access to the repository
          specified.
        </Text>
      </Box>
    );
  }
};

export default Issues;
