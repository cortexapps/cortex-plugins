import type React from "react";
import { useState, useEffect } from "react";

import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Flex,
} from "@chakra-ui/react";

import { isPagerDutyTokenValid } from "../hooks/pagerDutyHooks";

interface InstructionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsProps> = ({
  isOpen,
  onClose,
}) => {
  const [tokenInput, setTokenInput] = useState("");
  const [debouncedTokenInput, setDebouncedTokenInput] = useState("");

  const tokenIsValid = isPagerDutyTokenValid(debouncedTokenInput);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTokenInput(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTokenInput(tokenInput);
    }, 100);

    return () => {
      clearTimeout(handler);
    };
  }, [tokenInput]);

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
        <ModalHeader>Configure Plugin Proxy</ModalHeader>
        <ModalBody>
          <Box backgroundColor="light" margin={2} padding={4} borderRadius={2}>
            <Box>
              <form onSubmit={handleFormSubmit}>
                <FormControl isInvalid={!tokenIsValid}>
                  <FormLabel>PagerDuty REST API Token</FormLabel>
                  <Input
                    type="text"
                    name="token"
                    value={tokenInput}
                    onChange={handleInputChange}
                  />
                  {!tokenIsValid && (
                    <FormErrorMessage>
                      Please enter a valid token.
                    </FormErrorMessage>
                  )}
                </FormControl>
                <Flex justifyContent={"end"} mt={4}>
                  <Button
                    type="submit"
                    colorScheme="purple"
                    isDisabled={!tokenIsValid}
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
