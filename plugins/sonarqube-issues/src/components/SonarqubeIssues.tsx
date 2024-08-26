import React, { useMemo, useState, useEffect, useCallback } from "react";
import { PluginContextLocation } from "@cortexapps/plugin-core";
import {
  SimpleTable,
  Box,
  Text,
  Loader,
  usePluginContext,
  Modal,
  Button,
  Input,
} from "@cortexapps/plugin-core/components";
import "../baseStyles.css";

interface GitIssuesProps {
  entityYaml: Record<string, any>;
}

// Set your SonarQube url. Cloud is https://sonarcloud.io
const baseURL = "https://sonarcloud.io";

const SonarqubeIssues: React.FC<GitIssuesProps> = ({ entityYaml }) => {
  const [hasIssues, setHasIssues] = useState(false);
  const context = usePluginContext();

  const [posts, setPosts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(
    context.location === PluginContextLocation.Entity
  );

  const [issueForComment, setIssueForComment] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const openCommentModal = (issue: string): void => {
    setIssueForComment(issue);
    setIsModalOpen(true);
  };

  const sendComment = useCallback(async () => {
    const url = `${baseURL}/api/issues/add_comment`;

    const params = new URLSearchParams();
    params.append("issue", issueForComment as string);
    params.append("text", commentText);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (response.ok) {
        console.log("Comment added successfully");
      } else {
        console.error("Failed to add comment");
      }
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  }, [baseURL, issueForComment, commentText]);

  useEffect(() => {
    const project =
      entityYaml?.info?.["x-cortex-static-analysis"]?.sonarqube?.project;
    const fetchData = async (): Promise<void> => {
      try {
        const issueUrl = `${baseURL}/api/issues/search?componentKeys=${project}`;

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
  }, []);

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

  const config = {
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
          const message = issue.message;
          const url = `${baseURL}/project/issues?open=${issue.key}&id=${issue.project}`;
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
          <Button onClick={(): void => openCommentModal(key)}>Comment</Button>
        ),
        accessor: "key",
        id: "comment",
        title: "Comment",
        width: "15%",
      },
    ],
  };

  if (isLoading) {
    return <Loader />;
  }

  return hasIssues ? (
    <>
      <SimpleTable config={config} items={posts} />
      <Modal
        isOpen={isModalOpen}
        toggleModal={(): void => {
          setCommentText("");
          setIsModalOpen((prev) => !prev);
        }}
        title="Comment"
      >
        {issueForComment && issuesByKey[issueForComment] ? (
          <>
            <Text>
              Commenting on issue &nbsp;
              <i>{issuesByKey[issueForComment].message}</i>
            </Text>
            <br />
            <Input
              placeholder="Comment"
              value={commentText}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setCommentText(event.target.value)
              }
            />
            <br />
            <Button
              disabled={!commentText}
              onClick={(): void => {
                console.log(
                  "Commenting on issue",
                  issueForComment,
                  "with text",
                  commentText
                );
                sendComment();
                setCommentText("");
                setIsModalOpen(false);
              }}
            >
              Submit
            </Button>
          </>
        ) : (
          <Text>nope</Text>
        )}
      </Modal>
    </>
  ) : (
    <Box backgroundColor="light" padding={3} borderRadius={2}>
      <Text>
        We could not find any Sonarqube issues associated with this entity
      </Text>
    </Box>
  );
};

export default SonarqubeIssues;
