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
import type { InfoCardI, InfoRowI } from "../typings";
import { PiX, PiFloppyDisk } from "react-icons/pi";
import InfoLayout from "./InfoLayout";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleAction: () => void;
  infoRows: InfoRowI[];
  infoCards: InfoCardI[];
}

export default function PreviewModal({
  isOpen,
  onClose,
  handleAction,
  infoRows,
  infoCards,
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
          <InfoLayout infoRows={infoRows} infoCards={infoCards} />
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose} leftIcon={<PiX />}>
            Close Without Saving
          </Button>
          <Button
            colorScheme={"purple"}
            onClick={handleAction}
            leftIcon={<PiFloppyDisk />}
          >
            Save And Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
