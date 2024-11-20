import type React from "react";
import { useMemo, useState, useCallback } from "react";
import {
  SimpleTable,
  Box,
  Text,
  Loader,
  usePluginContext,
  Button,
} from "@cortexapps/plugin-core/components";

import { useToast } from "@chakra-ui/react";

import { useSonarQubeConfig, useSonarQubeIssues } from "../hooks";
import SonarQubeCommentModal from "./SonarQubeCommentModal";

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
  const context = usePluginContext();

  const [issueForComment, setIssueForComment] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const project = useMemo((): string => {
    return entityYaml?.info?.["x-cortex-static-analysis"]?.sonarqube?.project;
  }, [entityYaml?.info]);

  const { baseUrl, isLoading: isConfigLoading } = useSonarQubeConfig();
  const {
    issues,
    hasIssues,
    isLoading: isIssuesLoading,
  } = useSonarQubeIssues(baseUrl, project);

  const isLoading = isConfigLoading || isIssuesLoading;

  const openCommentModal = (issue: string): void => {
    setIssueForComment(issue);
    setIsModalOpen(true);
  };

  const sendComment = useCallback(
    async (commentText: string) => {
      const url = `${baseUrl}/api/issues/add_comment`;

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
          toast({
            title: "Comment added successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          const msg: string = await getErrorMessageFromResponse(response);
          throw new Error(msg);
        }
      } catch (err) {
        const msg: string = err.message || err.toString();
        toast({
          title: `Failed to add comment: ${msg}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [issueForComment, baseUrl, toast]
  );

  const issuesByKey = useMemo(() => {
    if (issues && issues instanceof Array && issues.length > 0) {
      return issues.reduce((acc: Record<string, any>, issue: any) => {
        const key = issue.key;
        acc[key] = issue;
        return acc;
      }, {});
    }
    return {};
  }, [issues]);

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
      {issueForComment && issuesByKey[issueForComment] && (
        <SonarQubeCommentModal
          isOpen={isModalOpen}
          toggleModal={() => {
            setIsModalOpen((prev) => !prev);
          }}
          issue={issuesByKey[issueForComment]}
          onCommentSubmit={sendComment}
        />
      )}
      <SimpleTable config={config} items={issues} />
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
