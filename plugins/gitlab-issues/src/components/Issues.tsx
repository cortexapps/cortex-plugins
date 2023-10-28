import React, { useState } from "react";
import { PluginContextLocation } from "@cortexapps/plugin-core";
import {
  SimpleTable,
  Box,
  Text,
  Loader,
  usePluginContext,
} from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import { getGitlabDetailsFromEntity } from "../lib/parseEntity";

interface GitIssuesProps {
  entityYaml: Record<string, any>;
}

// Set your GitLab url. Cloud is https://gitlab.com
const glURL = `https://gitlab.com/`;

const Issues: React.FC<GitIssuesProps> = ({ entityYaml }) => {
  const [hasIssues, setHasIssues] = useState(false);
  const context = usePluginContext();
  const [posts, setPosts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(
    context.location === PluginContextLocation.Entity
  );
  const { owner, repo, basepath } = getGitlabDetailsFromEntity(entityYaml) as {
    owner: string;
    repo: string;
    basepath: string;
  };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const cortexTag = context.entity!.tag;
      try {
        const issueUrl = basepath
          ? `${glURL}api/v4/projects/${owner}%2F${repo}/issues?labels=${cortexTag}`
          : `${glURL}api/v4/projects/${owner}%2F${repo}/issues?sort=asc`;

        const issuesResult = await fetch(issueUrl);
        const issuesJson = await issuesResult.json();

        if (issuesJson.length > 0) {
          setHasIssues(true);
          setPosts(issuesJson);
        }
      } catch (err) {
        console.error(`Error fetching issues:`, err);
      }
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

  return isLoading ? (
    <Loader />
  ) : hasIssues ? (
    <SimpleTable config={config} items={posts} />
  ) : (
    <Box backgroundColor="light" padding={3} borderRadius={2}>
      <Text>We could not find any issues associated with this entity</Text>
    </Box>
  );
};

export default Issues;
