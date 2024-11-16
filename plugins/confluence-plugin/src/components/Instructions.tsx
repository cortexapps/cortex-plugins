import type React from "react";

import { Text, Box } from "@cortexapps/plugin-core/components";

const Instructions: React.FC = () => (
  <Box backgroundColor="light" margin={2} padding={4} borderRadius={2}>
    <Text>
      This plugin makes it possible to view Confluence assets associated with an
      entity.
    </Text>
    <Text>
      To get started, please add an entity to Cortex like the following:
    </Text>
    <Box marginTop={4} padding={4} backgroundColor="white" borderRadius={2}>
      <pre>
        {`openapi: 3.0.1
info:
  title: Confluence Plugin Config
  x-cortex-tag: confluence-plugin-config
  x-cortex-type: pluginconfiguration
  x-cortex-definition:
    confluence-url: https://YOUR_INSTANCE.atlassian.net`}
      </pre>
    </Box>
  </Box>
);

export default Instructions;
