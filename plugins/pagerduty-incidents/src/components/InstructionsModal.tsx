import type React from "react";

import {
  Text,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  FormErrorMessage,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";

interface InstructionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsProps> = ({
  isOpen,
  onClose,
}) => {
  const [tokenInput, setTokenInput] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTokenInput(e.target.value);
    setIsSubmitDisabled(false); // todo: validate token before enabling submit
    setIsError(false); // todo: if token is invalid, set isError to true
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    // todo: handle form submit here
    e.preventDefault();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      size={"xl"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Instructions</ModalHeader>
        <ModalBody>
          <Box backgroundColor="light" margin={2} padding={4} borderRadius={2}>
            <Text>
              This plugin makes it possible to view PagerDuty incidents.
            </Text>
            <Text>
              To get started, please add your PagerDuty REST API token:
            </Text>

            <Box>
              <form onSubmit={handleFormSubmit}>
                <FormControl isInvalid={isError}>
                  <FormLabel>PagerDuty REST API Token</FormLabel>
                  <Input
                    type="text"
                    name="token"
                    value={tokenInput}
                    onChange={handleInputChange}
                  />
                  {!isError ? (
                    <FormHelperText>
                      You can generate REST API Token from your PagerDuty
                      dashboard.
                    </FormHelperText>
                  ) : (
                    <FormErrorMessage>
                      Please enter a valid token.
                    </FormErrorMessage>
                  )}
                </FormControl>
                <Flex justifyContent={"end"} mt={4}>
                  <Button
                    type="submit"
                    colorScheme="purple"
                    disabled={isSubmitDisabled}
                  >
                    Submit
                  </Button>
                </Flex>
              </form>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InstructionsModal;
