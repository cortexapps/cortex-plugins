import type React from "react";
import {
  Logo,
  PluginProvider,
  Stack,
  Title,
} from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import PluginContext from "./PluginContext";
import { useExample } from "@cortex-plugins/hooks";

const App: React.FC = () => {
  const example = useExample();
  console.warn(example);
  return (
    <ErrorBoundary>
      <PluginProvider>
        <Stack>
          <Logo />
          <Title level={1}>My Awesome Cortex Plugin</Title>
        </Stack>
        <PluginContext />
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
