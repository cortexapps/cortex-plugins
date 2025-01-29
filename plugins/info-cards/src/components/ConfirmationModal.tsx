import type React from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Heading,
} from "@chakra-ui/react";

interface DeleteInfoRowConfirmationModalProps extends React.PropsWithChildren {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  handleAction: () => void;
  actionButtonText?: string;
  actionButtonColorScheme?: string;
}

const ConfirmationModal: React.FC<DeleteInfoRowConfirmationModalProps> = ({
  isOpen,
  onClose,
  handleAction,
  actionButtonText = "Confirm",
  title = "Confirmation Required",
  actionButtonColorScheme = "purple",
  children,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xs"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size={"md"}>{title}</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme={actionButtonColorScheme} onClick={handleAction}>
            {actionButtonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
