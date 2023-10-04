import React from "react";
import { PluginContextLocation } from "@cortexapps/plugin-core";
import {
  SimpleTable,
  Box,
  Text,
  Loader,
  usePluginContext,
} from "@cortexapps/plugin-core/components";
import "../baseStyles.css";

// Set your Github url. Cloud is https://api.github.com
const ghURL = `https://api.github.com/`;
let hasGitHub: boolean = false;
let hasIssues: boolean = false;
const Issues: React.FC = () => {
  const context = usePluginContext();
  console.log(context);
  const [posts, setPosts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(
    context.location === PluginContextLocation.Entity
  );
  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const cortexTag = context.entity!.tag;
      const cortexURL = context.apiBaseUrl;
      const serviceResult = await fetch(
        `${cortexURL}/catalog/${cortexTag}/openapi`
      );
      const serviceJson = await serviceResult.json();
      try {
        if (
          serviceJson.info?.["x-cortex-git"].github.repository !== undefined
        ) {
          hasGitHub = true;
          // If we have a GitHub tag, we assume there is a repo defined, let's get the value
          const ghRepo: string =
            serviceJson.info["x-cortex-git"].github.repository;
          // Let's check if we have a basepath defined, to check for mono repo
          let issueURL: string = "";
          if (serviceJson.info["x-cortex-git"].github.basepath !== undefined) {
            // we are going to assume that each service is being tracked via labels
            issueURL = `${ghURL}repos/${ghRepo}/issues?labels=${cortexTag}`;
          } else {
            issueURL = `${ghURL}repos/${ghRepo}/issues?direction=asc`;
          }
          const issuesResult = await fetch(issueURL);
          const issuesJson = await issuesResult.json();
          if (issuesJson.length > 0) {
            hasIssues = true;
            setPosts(issuesJson);
          }
        }
      } catch (Error) {}
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
    return isLoading ? (
      <Loader />
    ) : (
      <SimpleTable config={config} items={posts} />
    );
  } else if (hasGitHub && !hasIssues) {
    return isLoading ? (
      <Loader />
    ) : (
      <Box backgroundColor="light" padding={3} borderRadius={2}>
        <Text>We could not find any Issues associated to this Service</Text>
      </Box>
    );
  } else {
    return isLoading ? (
      <Loader />
    ) : (
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
