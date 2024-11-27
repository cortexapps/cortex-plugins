import type React from "react";

import { Text, Box, Button, useDisclosure } from "@chakra-ui/react";

import InstructionsModal from "./InstructionsModal";

const Instructions: React.FC = () => {
  const {
    isOpen: isInstuctionsModalOpen,
    onOpen: onInstructionsModalOpen,
    onClose: onInstructionsModalClose,
  } = useDisclosure();

  return (
    <Box minH="400px" backgroundColor="light" margin={2} padding={4} borderRadius={2}>
      <Text>
        This plugin makes it possible to view PagerDuty incidents associated with an
        entity. To get started, you need a PagerDuty API key and permissions to create
        proxies and secrets in Cortex. Click the button below to configure the plugin.
      </Text>
      <Button onClick={onInstructionsModalOpen} colorScheme="purple">
        Configure
      </Button>
      <InstructionsModal
        isOpen={isInstuctionsModalOpen}
        onClose={onInstructionsModalClose}
      />
    </Box>
  );
}

export default Instructions;
