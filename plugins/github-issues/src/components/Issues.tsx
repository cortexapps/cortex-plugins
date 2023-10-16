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
import { getGithubDetailsFromEntity } from "../lib/parseEntity";

interface GitIssuesProps {
  entityYaml: Record<string, any>;
}

// Set your Github url. Cloud is https://api.github.com
const ghURL = `https://api.github.com/`;

const Issues: React.FC<GitIssuesProps> = ({ entityYaml }) => {
  const [hasIssues, setHasIssues] = useState(false);
  const context = usePluginContext();

  const [posts, setPosts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(
    context.location === PluginContextLocation.Entity
  );
  const { owner, repo, basepath } = getGithubDetailsFromEntity(entityYaml) as {
    owner: string;
    repo: string;
    basepath: string;
  };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const cortexTag = context.entity!.tag;
      try {
        let issueURL: string = "";
        if (basepath !== undefined) {
          // we are going to assume that each service is being tracked via labels
          issueURL = `${ghURL}repos/${owner}/${repo}/issues?labels=${cortexTag}`;
        } else {
          issueURL = `${ghURL}repos/${owner}/${repo}/issues?direction=asc`;
        }
        const issuesResult = await fetch(issueURL);
        const issuesJson = await issuesResult.json();
        if (issuesJson.length > 0) {
          setHasIssues(true);
          setPosts(issuesJson);
        }
        // }
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

  return isLoading ? (
    <Loader />
  ) : hasIssues ? (
    
      <SimpleTable config={config} items={posts} />
    
  ) : (
    <Box backgroundColor="light" padding={3} borderRadius={2}>
      <Text>We could not find any Issues associated to this Service</Text>
    </Box>
  );
};

export default Issues;
