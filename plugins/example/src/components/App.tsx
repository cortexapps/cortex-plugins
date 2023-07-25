import type React from "react";
import {
  Box,
  // Badge,
  // Button,
  Logo,
  PluginProvider,
  Stack,
  Title,
} from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import PluginContext from "./PluginContext";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <Stack>
          <Logo />
          <Title level={1}>My Awesome Cortex Plugin</Title>
        </Stack>
        <PluginContext />
        <Box justifyContent="center" alignItems="center">
          Hello
        </Box>
        {/* <Badge>test</Badge> */}
        {/* <Button onClick={() => {console.log("Hello World!")}}>Click me</Button> */}
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
