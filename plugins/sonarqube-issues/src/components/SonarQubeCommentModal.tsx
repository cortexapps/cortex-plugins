import type React from "react";
import { useCallback, useState } from "react";

import { Text, Modal, Button, Input } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";

interface SonarQubeCommentModalProps {
  issueForComment: Record<string, any>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sonarqubeApiBaseUrl: string;
}

const SonarQubeCommentModal: React.FC<SonarQubeCommentModalProps> = ({
  issueForComment,
  isModalOpen,
  setIsModalOpen,
  sonarqubeApiBaseUrl,
}) => {
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendComment = useCallback(async () => {
    const url = `${sonarqubeApiBaseUrl}/api/issues/add_comment`;

    const params = new URLSearchParams();
    params.append("issue", issueForComment.key);
    params.append("text", commentText);

    setIsLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        console.error("Failed to add comment", response);
      }
    } catch (err) {
      console.error("Failed to add comment", err);
    }
    setIsLoading(false);
  }, [issueForComment, commentText, sonarqubeApiBaseUrl]);

  if (!issueForComment || !sonarqubeApiBaseUrl) {
    return null;
  }

  return (
    <Modal
      isOpen={isModalOpen}
      toggleModal={(): void => {
        setCommentText("");
        setIsModalOpen((prev) => !prev);
      }}
      title="Comment"
    >
      <>
        <Text>
          Commenting on issue &nbsp;
          <i>{issueForComment.message}</i>
        </Text>
        <br />
        <Input
          placeholder="Comment"
          value={commentText}
          disabled={isLoading}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCommentText(event.target.value);
          }}
        />
        <br />
        <Button
          disabled={!commentText || isLoading}
          onClick={(): void => {
            void sendComment().then(() => {
              setCommentText("");
              setIsModalOpen(false);
            });
          }}
        >
          Submit
        </Button>
        {isLoading && (
          <>
            <br />
            <Text>
              Adding comment to issue <i>{issueForComment?.key || ""}</i>...
            </Text>
          </>
        )}
      </>
    </Modal>
  );
};

export default SonarQubeCommentModal;
