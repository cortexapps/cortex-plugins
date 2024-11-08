import type React from "react";

import { Text, Box } from "@cortexapps/plugin-core/components";

const Instructions: React.FC = () => (
  <Box backgroundColor="light" margin={2} padding={4} borderRadius={2}>
    <Text>
      This plugin will fetch incidents from ServiceNow and display them here.
    </Text>
    <Text>
      To get started, please add an entity to Cortex like the following:
    </Text>
    <Box marginTop={4} padding={4} backgroundColor="white" borderRadius={2}>
      <pre>
        {`openapi: 3.0.1
info:
  title: ServiceNow Plugin Config
  x-cortex-tag: servicenow-plugin-config
  x-cortex-type: pluginconfiguration
  x-cortex-definition:
    servicenow-url: https://YOUR_INSTANCE.service-now.com`}
      </pre>
    </Box>
  </Box>
);

export default Instructions;
