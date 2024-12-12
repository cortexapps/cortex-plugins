import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";

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

import { usePluginContext } from "@cortexapps/plugin-core/components";

import { useErrorToast } from "../hooks/uiHooks";
import { useIsPagerDutyTokenValid } from "../hooks/pagerDutyHooks";

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
  const { apiBaseUrl } = usePluginContext();

  const apiOrigin = useMemo(
    () => (apiBaseUrl ? new URL(apiBaseUrl).origin : ""),
    [apiBaseUrl]
  );

  const internalBaseUrl = `${apiOrigin}/api/internal/v1`;

  const [tokenInput, setTokenInput] = useState("");
  const [debouncedTokenInput, setDebouncedTokenInput] = useState("");

  const tokenIsValid = useIsPagerDutyTokenValid(debouncedTokenInput);
  const errorToast = useErrorToast();

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

  const doAddSecret = useCallback(async (): Promise<boolean> => {
    console.log("Adding secret");
    const body = JSON.stringify({
      name: "pagerduty_secret",
      tag: "pagerduty_secret",
      secret: debouncedTokenInput,
    });

    try {
      const response = await fetch(`${internalBaseUrl}/secrets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response?.ok) {
        const message =
          (response as any).cortexResponse?.statusText ||
          response.statusText ||
          "An error occurred";
        throw new Error(message);
      }
      return true;
    } catch (e) {
      console.log("Failed to add secret", e);
      let message = e.message || "An error occurred";
      try {
        const data = JSON.parse(e.message);
        message = data.details || data.message || message;
      } catch (e) {
        // Ignore
      }
      errorToast({
        title: "Failed to add secret",
        message,
      });
    }
    return false;
  }, [internalBaseUrl, debouncedTokenInput, errorToast]);

  const doAddProxy = useCallback(async (): Promise<boolean> => {
    const body = JSON.stringify({
      name: "PagerDuty Plugin Proxy",
      tag: "pagerduty-plugin-proxy",
      urlConfigurations: {
        "https://api.pagerduty.com": {
          urlHeaders: [
            {
              name: "Authorization",
              value: `Token token={{{secrets.pagerduty_secret}}}`,
            },
          ],
        },
      },
    });

    try {
      const response = await fetch(`${internalBaseUrl}/proxies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response?.ok) {
        const message =
          (response as any).cortexResponse?.statusText ||
          response.statusText ||
          "An error occurred";
        throw new Error(message);
      }
      return true;
    } catch (e) {
      console.error("Failed to add proxy", e);
      let message = e.message || "An error occurred";
      try {
        const data = JSON.parse(e.message);
        message = data.details || data.message || message;
      } catch (e) {
        // Ignore
      }
      errorToast({
        title: "Failed to add proxy",
        message,
      });
    }
    return false;
  }, [internalBaseUrl, errorToast]);

  const doUpdatePlugin = useCallback(async (): Promise<boolean> => {
    try {
      let response = await fetch(`${apiBaseUrl}/plugins/pagerduty-incidents`);
      if (!response.ok) {
        throw new Error("Failed to fetch plugin metadata");
      }
      const plugin = await response.json();
      const pluginDescription = plugin.description || "";
      if (
        !pluginDescription.includes(
          "https://plugin-marketplace.s3.us-east-2.amazonaws.com/pagerduty-plugin/ui.html"
        )
      ) {
        throw new Error(
          "This pagerduty-incidents plugin was not installed by the Plugin Marketplace"
        );
      }
      response = await fetch(
        "https://plugin-marketplace.s3.us-east-2.amazonaws.com/pagerduty-plugin/ui.html"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch plugin UI");
      }
      const ui = await response.text();
      plugin.proxyTag = "pagerduty-plugin-proxy";
      plugin.blob = ui;
      response = await fetch(`${apiBaseUrl}/plugins/pagerduty-incidents`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plugin),
      });
      if (!response.ok) {
        throw new Error("Failed to update plugin");
      }
      return true;
    } catch (e) {
      console.error("Failed to update plugin", e);
      let message = e.message || "An error occurred";
      try {
        const data = JSON.parse(e.message);
        message = data.details || data.message || message;
      } catch (e) {
        // Ignore
      }
      errorToast({
        title: "Failed to update plugin",
        message,
      });
    }
    return false;
  }, [apiBaseUrl, errorToast]);

  const handleFormSubmit = useCallback(() => {
    const handleAsync = async (
      e: React.MouseEvent<HTMLButtonElement>
    ): Promise<void> => {
      e.preventDefault();
      const didUpdatePlugin =
        (await doAddSecret()) &&
        (await doAddProxy()) &&
        (await doUpdatePlugin());
      setTokenInput("");
      if (didUpdatePlugin) {
        onConfigCompleted();
      }
      onClose();
    };
    void handleAsync;
  }, [onClose, doAddSecret, doAddProxy, doUpdatePlugin, onConfigCompleted]);

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
                  onClick={handleFormSubmit}
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
