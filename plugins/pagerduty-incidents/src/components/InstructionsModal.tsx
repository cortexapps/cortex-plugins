import type React from "react";
import { useState, useEffect, useCallback } from "react";

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

import { useIsPagerDutyTokenValid } from "../hooks/pagerDutyHooks";
import { usePluginUpdateFns } from "../hooks/cortexHooks";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigCompleted: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
  onConfigCompleted,
}) => {
  const {
    doAddSecret,
    doAddProxy,
    doUpdatePlugin,
  } = usePluginUpdateFns();

  const [tokenInput, setTokenInput] = useState("");
  const [debouncedTokenInput, setDebouncedTokenInput] = useState("");

  const tokenIsValid = useIsPagerDutyTokenValid(debouncedTokenInput);

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

  const handleFormSubmit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const didUpdatePlugin =
        (await doAddSecret("pagerduty_secret", debouncedTokenInput)) &&
        (await doAddProxy("PagerDuty Plugin Proxy", "pagerduty-plugin-proxy", "pagerduty_secret")) &&
        (await doUpdatePlugin("pagerduty-incidents", "https://plugin-marketplace.s3.us-east-2.amazonaws.com/pagerduty-plugin/ui.html", "pagerduty-plugin-proxy"));
      setTokenInput("");
      if (didUpdatePlugin) {
        onConfigCompleted();
      }
      onClose();
    },
    [onClose, doAddSecret, doAddProxy, doUpdatePlugin, onConfigCompleted, debouncedTokenInput]
  );

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
              <FormControl isInvalid={!tokenIsValid}>
                <FormLabel>PagerDuty REST API Token</FormLabel>
                <Input
                  type="password"
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
                  colorScheme="purple"
                  isDisabled={!tokenIsValid}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    void handleFormSubmit(e);
                  }}
                >
                  Submit
                </Button>
              </Flex>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InstructionsModal;
