import type React from "react";
import {
  Logo,
  PluginProvider,
  Stack,
  Title,
} from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import CortexEntity from "./EntityGitInfo";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <Stack>
          <Logo />
          <Title level={1}>GitHub Releases</Title>
          <CortexEntity />
        </Stack>
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
