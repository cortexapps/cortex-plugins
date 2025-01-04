import { Box, Button, Text } from "@cortexapps/plugin-core/components";
import { useMemo } from "react";

interface Column {
  Cell: (value: any) => JSX.Element;
  accessor?: string;
  id: string;
  title: string;
  width: string;
}

export const useTableConfig = (
  baseUrl: string,
  openCommentModal: (key: string) => void
): { columns: Column[] } => {
  return useMemo(
    () => ({
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
    }),
    [baseUrl, openCommentModal]
  );
};
