import React from "react";
import { CortexApi } from "@cortexapps/plugin-core";
import {
  SimpleTable,
  Box,
  Text,
  usePluginContext,
} from "@cortexapps/plugin-core/components";
import "../baseStyles.css";

// Set your Github url. Cloud is https://api.github.com
const ghURL = `https://api.github.com/`;
let hasGitHub: boolean = false;
// function to get Cortex API Basepath
const Issues: React.FC = () => {
  const context = usePluginContext();
  console.log(context);
  const [posts, setPosts] = React.useState<any[]>([]);
  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const cortexTag = context.entity!.tag;
      console.log(cortexTag);
      const cortexURL = context.apiBaseUrl;
      console.log(cortexURL);
      const result = await fetch(`${cortexURL}/catalog/${cortexTag}/openapi`);
      const resultJson = await result.json();
      console.log({ resultJson });
      if (resultJson.info?.["x-cortex-git"].github.repository !== undefined) {
        hasGitHub = true;
        // If we have a GitHub tag, we assume there is a repo defined, let's get the value
        const ghRepo: string =
          resultJson.info["x-cortex-git"].github.repository;
        console.log(ghRepo);
        // Let's check if we have a basepath defined, to check for mono repo
        if (resultJson.info["x-cortex-git"].github.basepath !== undefined) {
          console.log("has basepath");
          // we are going to assume that each service is being tracked via labels
          const url: string = `${ghURL}repos/${ghRepo}/issues?labels=${cortexTag}`;
          console.log(url);
          const iResult = await fetch(url);
          const jResult = await iResult.json();
          console.log({ jResult });
          setPosts(jResult);
        } else {
          console.log("Doesn't have basepath");
          const iResult = await CortexApi.proxyFetch(
            `${ghURL}repos/${ghRepo}/issues?direction=asc`
          );
          const jResult = await iResult.json();
          console.log({ jResult });
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

  if (hasGitHub) {
    return <SimpleTable config={config} items={posts} />;
  } else {
    return (
      <Box backgroundColor="light" padding={3} borderRadius={2}>
        <Text>
          This service does not have a GitHub Repo defined in the Service YAML
          or the GitHub Access Token does not access to the repository
          specified.
        </Text>
      </Box>
    );
  }
};

export default Issues;
