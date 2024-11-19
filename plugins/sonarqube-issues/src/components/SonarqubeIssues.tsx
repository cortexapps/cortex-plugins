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

import { useToast } from "@chakra-ui/react";

import "../baseStyles.css";

const getErrorMessageFromResponse = async (
  response: Response
): Promise<string> => {
  if (response.headers.get("Content-Type")?.includes("application/json")) {
    try {
      const json = await response.json();
      const msg: string = json.message;
      return msg;
    } catch (e) {}
  }
  return response.statusText || response.status.toString();
};

interface SonarqubeIssuesProps {
  entityYaml: Record<string, any>;
}

const SonarqubeIssues: React.FC<SonarqubeIssuesProps> = ({ entityYaml }) => {
  const toast = useToast();
  const [baseUrl, setBaseUrl] = useState("");
  const [hasIssues, setHasIssues] = useState(false);
  const context = usePluginContext();

  const [posts, setPosts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(
    context.location === PluginContextLocation.Entity
  );

  const [issueForComment, setIssueForComment] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const project = useMemo((): string => {
    return entityYaml?.info?.["x-cortex-static-analysis"]?.sonarqube?.project;
  }, [entityYaml?.info]);

  useEffect(() => {
    if (!context?.apiBaseUrl) {
      return;
    }
    const fetchPluginConfig = async (): Promise<void> => {
      let newBaseUrl = "https://sonarcloud.io";
      try {
        const response = await fetch(
          `${context.apiBaseUrl}/catalog/sonarqube-plugin-config/openapi`
        );
        const data = await response.json();
        newBaseUrl = data.info["x-cortex-definition"]["sonarqube-url"];
      } catch (e) {}
      setBaseUrl(newBaseUrl);
    };
    void fetchPluginConfig();
  }, [context?.apiBaseUrl]);

  const openCommentModal = (issue: string): void => {
    setIssueForComment(issue);
    setIsModalOpen(true);
  };

  const sendComment = useCallback(async () => {
    const url = `${baseUrl}/api/issues/add_comment`;

    const params = new URLSearchParams();
    params.append("issue", issueForComment as string);
    params.append("text", commentText);

    try {
      setIsCommenting(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (response.ok) {
        toast({
          title: "Comment added successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        const msg = await getErrorMessageFromResponse(response);
        toast({
          title: `Failed to add comment: ${msg}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      const msg: string = err.toString();
      toast({
        title: `Failed to add comment: ${msg}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsCommenting(false);
  }, [issueForComment, commentText, baseUrl, toast]);

  useEffect(() => {
    if (!project || !baseUrl) {
      setIsLoading(false);
      return;
    }
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const issueUrl: string = `${baseUrl}/api/issues/search?componentKeys=${project}&resolved=false&s=CREATION_DATE&asc=false`;

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
        const msg: string = err.toString();
        toast({
          title: `Failed to fetch issues: ${msg}`,
          status: "error",
          duration: null,
          isClosable: true,
        });
      }
      setIsLoading(false);
    };
    void fetchData();
  }, [entityYaml?.info, baseUrl, project, toast]);

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
        Cell: (createdAt: string) => {
          const createdAtDate = new Date(createdAt);
          if (!createdAtDate || isNaN(createdAtDate.getTime())) {
            return (
              <Box>
                <Text>{createdAt}</Text>
              </Box>
            );
          }
          return (
            <Box>
              <Text>
                {createdAtDate ? createdAtDate.toLocaleString() : createdAt}
              </Text>
            </Box>
          );
        },
        accessor: "creationDate",
        id: "creationDate",
        title: "Created At",
        width: "20%",
      },
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
        Cell: (issue: any) => {
          const key: string = issue.key || "";
          const project: string = issue.project || "";
          const message = issue.message || "";
          if (!key || !project || !message) {
            return <Text>Issue not found</Text>;
          }
          const url = `${baseUrl}/project/issues?open=${key}&id=${project}`;
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
        id: "message",
        title: "Message",
        width: "45%",
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
        width: "10%",
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
        {issueForComment && issuesByKey[issueForComment] && (
          <>
            <Text>
              Commenting on issue &nbsp;
              <i>{issuesByKey[issueForComment].message}</i>
            </Text>
            <br />
            <Input
              placeholder="Comment"
              value={commentText}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setCommentText(event.target.value);
              }}
            />
            <br />
            <Button
              disabled={!commentText || isCommenting}
              onClick={(): void => {
                void sendComment().then(() => {
                  setCommentText("");
                  setIsModalOpen(false);
                });
              }}
            >
              {isCommenting ? "Commenting..." : "Comment"}
            </Button>
          </>
        )}
      </Modal>
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
