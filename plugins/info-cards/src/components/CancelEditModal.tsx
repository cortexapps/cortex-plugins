import { useRef } from "react";

import {
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  // AlertDialogCloseButton,
} from "@chakra-ui/react";

interface CancelEditModalProps {
  isModified: boolean;
  toggleEditor: () => void;
}

const CancelEditModal: React.FC<CancelEditModalProps> = ({
  isModified,
  toggleEditor,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        colorScheme="red"
        variant="outline"
        onClick={() => {
          if (isModified) {
            onOpen();
          } else {
            toggleEditor();
          }
        }}
      >
        Cancel
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Discard Changes?
            </AlertDialogHeader>

            <AlertDialogBody>
              You have unsaved changes. Are you sure you want to close the
              editor?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} mr={2} onClick={onClose}>
                No
              </Button>
              <Button colorScheme="red" onClick={toggleEditor}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default CancelEditModal;
