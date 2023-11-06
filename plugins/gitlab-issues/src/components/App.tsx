import type React from "react";
import { Box, Title, PluginProvider } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import CortexEntity from "./EntityInfo";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <Box>
          <img
            src="https://about.gitlab.com/images/press/logo/png/gitlab-logo-500.png"
            width="100"
            height="100"
          />
          <Title level={1}>GitLab Issues</Title>
        </Box>
        <CortexEntity />
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
