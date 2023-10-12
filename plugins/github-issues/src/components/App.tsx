import type React from "react";
import { Box, PluginProvider, Title } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import CortexEntity from "./EntityInfo";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <Box flex>
          <img
            src="https://github.githubassets.com/favicons/favicon.svg"
            width="50"
            height="50"
          />
          <Title level={1}>GitHub Issues</Title>
        </Box>
        <CortexEntity />
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
