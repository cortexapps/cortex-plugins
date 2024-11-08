import React, { useMemo, useState, useEffect } from "react";
import { PluginContextLocation } from "@cortexapps/plugin-core";
import {
  SimpleTable,
  Box,
  Text,
  Loader,
  usePluginContext,
  // Modal,
  Button,
  // Input,
} from "@cortexapps/plugin-core/components";

import SonarQubeCommentModal from "./SonarQubeCommentModal";

import "../baseStyles.css";

interface SonarqubeIssuesProps {
  entityYaml: Record<string, any>;
}

const SonarqubeIssues: React.FC<SonarqubeIssuesProps> = ({ entityYaml }) => {
  const [sonarqubeApiBaseUrl, setSonarqubeApiBaseUrl] = useState("");
  const [hasIssues, setHasIssues] = useState(false);
  const context = usePluginContext();

  const [posts, setPosts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(
    context.location === PluginContextLocation.Entity
  );

  const [issueForComment, setIssueForComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const apiBaseUrl = context.apiBaseUrl;
    if (!apiBaseUrl) {
      return;
    }
    const getSonarqubePluginConfig = async (): Promise<void> => {
      setIsLoading(true);
      let newSnowUrl = "https://sonarcloud.io";
      try {
        const response = await fetch(
          `${apiBaseUrl}/catalog/sonarqube-plugin-config/openapi`
        );
        const data = await response.json();
        newSnowUrl = data.info["x-cortex-definition"]["sonarqube-api-url"];
      } catch (e) {}
      setSonarqubeApiBaseUrl(newSnowUrl);
      setIsLoading(false);
    };
    void getSonarqubePluginConfig();
  }, [context?.apiBaseUrl]);

  const openCommentModal = (issue: string): void => {
    setIssueForComment(issue);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const project: string =
      entityYaml?.info?.["x-cortex-static-analysis"]?.sonarqube?.project || "";
    if (!project || !sonarqubeApiBaseUrl) {
      return;
    }
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const issueUrl: string = `${sonarqubeApiBaseUrl}/api/issues/search?componentKeys=${project}`;

        const issuesResult = await fetch(issueUrl);
        const issuesJson = await issuesResult.json();
        if (
          issuesJson.issues instanceof Array &&
          issuesJson.issues.length > 0
        ) {
          setHasIssues(true);
          setPosts(issuesJson.issues);
        }
      } catch (err) {
        console.error(`Error fetching issues:`, err);
      }
      setIsLoading(false);
    };
    void fetchData();
  }, [entityYaml?.info, sonarqubeApiBaseUrl]);

  const issuesByKey = useMemo(() => {
    if (posts && posts instanceof Array && posts.length > 0) {
      return posts.reduce((acc: Record<string, any>, issue: any) => {
        const key = issue.key;
        acc[key] = issue;
        return acc;
      }, {});
    }
    return {};
  }, [posts]);

  const config = useMemo(
    () => ({
      columns: [
        {
          Cell: (severity: string) => (
            <Box>
              <Text>{severity.toLocaleLowerCase()}</Text>
            </Box>
          ),
          accessor: "severity",
          id: "severity",
          title: "Severity",
          width: "10%",
        },
        {
          Cell: (author: string) => (
            <Box>
              <Text>{author}</Text>
            </Box>
          ),
          accessor: "author",
          id: "author",
          title: "Author",
          width: "15%",
        },
        {
          Cell: (key: string) => {
            const issue = issuesByKey[key];
            const project: string = issue.project || "";
            const message = issue.message;
            const url = `${sonarqubeApiBaseUrl}/project/issues?open=${key}&id=${project}`;
            return (
              <Box>
                <Text>
                  <a href={url} target="_blank" rel="noreferrer">
                    {message}
                  </a>
                </Text>
              </Box>
            );
          },
          accessor: "key",
          id: "message",
          title: "Message",
          width: "50%",
        },
        {
          Cell: (key: string) => (
            <Button
              onClick={(): void => {
                openCommentModal(key);
              }}
            >
              Comment
            </Button>
          ),
          accessor: "key",
          id: "comment",
          title: "Comment",
          width: "15%",
        },
      ],
    }),
    [issuesByKey, sonarqubeApiBaseUrl]
  );

  if (isLoading) {
    return <Loader />;
  }

  return hasIssues ? (
    <>
      <SimpleTable config={config} items={posts} />
      <SonarQubeCommentModal
        issueForComment={issuesByKey[issueForComment]}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        sonarqubeApiBaseUrl={sonarqubeApiBaseUrl}
      />
    </>
  ) : (
    <Box backgroundColor="light" padding={3} borderRadius={2}>
      <Text>
        We could not find any Sonarqube issues associated with this{" "}
        {context?.entity?.type ?? "entity"}.
      </Text>
    </Box>
  );
};

export default SonarqubeIssues;
