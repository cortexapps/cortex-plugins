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

// Set your Gitlab url. Cloud is https://gitlab.com
const glURL = `https://gitlab.com/`;
let hasGitLab: boolean = false;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let hasIssues: boolean = false;
const Issues: React.FC = () => {
  const context = usePluginContext();
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
          serviceJson.info?.["x-cortex-git"].gitlab.repository !== undefined
        ) {
          hasGitLab = true;
          // If we have a GitHub tag, we assume there is a repo defined, let's get the value
          const glRepo: string =
            serviceJson.info["x-cortex-git"].gitlab.repository;
          // Gitlab API requires us to take the owner/project format
          // and change it to owner%2Fproject format
          const encodedRepo = glRepo.replace("/", "%2F");
          // Let's check if we have a basepath defined, to check for mono repo
          let issuesUrl: string = "";
          if (serviceJson.info["x-cortex-git"].gitlab.basepath !== undefined) {
            // we are going to assume that each service is being tracked via labels
            issuesUrl = `${glURL}api/v4/projects/${encodedRepo}/issues?labels=${cortexTag}`;
          } else {
            issuesUrl = `${glURL}api/v4/projects/${encodedRepo}/issues?sort=asc`;
          }
          const issuesResult = await fetch(issuesUrl);
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
    return isLoading ? (
      <Loader />
    ) : (
      <SimpleTable config={config} items={posts} />
    );
  } else if (hasGitLab && !hasIssues) {
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
          This service does not have a GitLab Repo defined in the Service YAML
          or the GitLab Access Token does not have access to the repository
          specified.
        </Text>
      </Box>
    );
  }
};

export default Issues;
