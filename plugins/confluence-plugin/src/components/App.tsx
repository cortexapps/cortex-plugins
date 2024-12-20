import type React from "react";
import { PluginProvider } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import PageContent from "./PageContent";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <PageContent />
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
