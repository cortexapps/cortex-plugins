import type React from "react";

import {
  Text,
  Box,
  Button,
  Link,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";

import InstructionsModal from "./InstructionsModal";
import { useState, useEffect } from "react";

import { usePluginContext } from "@cortexapps/plugin-core/components";

const Instructions: React.FC = () => {
  const { apiBaseUrl } = usePluginContext();
  const {
    isOpen: isInstuctionsModalOpen,
    onOpen: onInstructionsModalOpen,
    onClose: onInstructionsModalClose,
  } = useDisclosure();

  const [isMarketplacePlugin, setIsMarketplacePlugin] = useState<
    boolean | null
  >(null);
  const [configCompleted, setConfigCompleted] = useState(false);

  useEffect(() => {
    const fetchMarketplacePlugin = async (): Promise<void> => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/plugins/pagerduty-incidents`
        );
        const { description } = await response.json();
        setIsMarketplacePlugin(
          description.includes(
            "https://plugin-marketplace.s3.us-east-2.amazonaws.com/pagerduty-plugin/ui.html"
          )
        );
      } catch (e) {
        setIsMarketplacePlugin(false);
      }
    };
    void fetchMarketplacePlugin();
  }, [apiBaseUrl]);

  const onConfigCompleted = (): void => {
    setConfigCompleted(true);
  };

  if (configCompleted) {
    return (
      <Box
        minH="400px"
        backgroundColor="light"
        margin={2}
        padding={4}
        borderRadius={2}
      >
        <Heading as="h2" size="md" marginBottom={4}>
          Configure PagerDuty Incidents Plugin
        </Heading>
        <Text>
          Configuration completed successfully. Please refresh the page to start
          using the plugin.
        </Text>
      </Box>
    );
  }

  return (
    <Box
      minH="400px"
      backgroundColor="light"
      margin={2}
      padding={4}
      borderRadius={2}
    >
      <Heading as="h2" size="md" marginBottom={4}>
        Configure PagerDuty Incidents Plugin
      </Heading>
      {isMarketplacePlugin && (
        <>
          <Text>
            To configure this plugin automatically, you need a PagerDuty API key
            and permissions to create proxies and secrets in Cortex. Click the
            button below to enter your PagerDuty API key and do automatic
            configuration.
          </Text>
          <Button onClick={onInstructionsModalOpen} colorScheme="purple">
            Configure
          </Button>
          <InstructionsModal
            isOpen={isInstuctionsModalOpen}
            onClose={onInstructionsModalClose}
            onConfigCompleted={onConfigCompleted}
          />
        </>
      )}
      {isMarketplacePlugin === false && (
        <Text>
          This plugin was not installed by the Plugin Marketplace, so it cannot
          be configured automatically. To configure it manually, follow the
          instructions in the plugin documentation{" "}
          <Link
            display="inline"
            target="_blank"
            href="https://github.com/cortexapps/cortex-plugins/blob/master/plugins/pagerduty-incidents/README.md"
          >
            here
          </Link>
          .
        </Text>
      )}
    </Box>
  );
};

export default Instructions;
