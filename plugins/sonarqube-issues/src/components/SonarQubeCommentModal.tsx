import type React from "react";
import { useState } from "react";
import { Modal, Button, Input, Text } from "@cortexapps/plugin-core/components";

interface SonarQubeCommentModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  issue: any;
  onCommentSubmit: (commentText: string) => Promise<void>;
}

const SonarQubeCommentModal: React.FC<SonarQubeCommentModalProps> = ({
  isOpen,
  toggleModal,
  issue,
  onCommentSubmit,
}) => {
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (): void => {
    setIsCommenting(true);
    void onCommentSubmit(commentText).then(() => {
      setCommentText("");
      setIsCommenting(false);
      toggleModal();
    });
  };

  return (
    <Modal isOpen={isOpen} toggleModal={toggleModal} title="Comment">
      <Text>
        Commenting on Issue <i>{issue.message || issue.key}</i>
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
      <Button disabled={!commentText || isCommenting} onClick={handleSubmit}>
        {isCommenting ? "Commenting..." : "Comment"}
      </Button>
    </Modal>
  );
};

export default SonarQubeCommentModal;
