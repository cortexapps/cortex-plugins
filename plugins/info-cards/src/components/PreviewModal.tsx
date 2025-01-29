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
import type { InfoRowI } from "../typings";
// import { PiX, PiFloppyDisk } from "react-icons/pi";
import InfoLayout from "./InfoLayout";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleAction: () => void;
  infoRows: InfoRowI[];
}

export default function PreviewModal({
  isOpen,
  onClose,
  handleAction,
  infoRows,
}: PreviewModalProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading>Layout Preview</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InfoLayout infoRows={infoRows} />
        </ModalBody>
        <ModalFooter>
          <Button
            variant={"outline"}
            colorScheme={"red"}
            mr={2}
            onClick={onClose}
          >
            Back to Editor
          </Button>
          <Button
            variant={"solid"}
            colorScheme={"green"}
            onClick={handleAction}
          >
            Save and Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
