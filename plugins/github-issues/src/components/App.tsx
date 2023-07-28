import type React from "react";
import { PluginProvider } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import Issues from "./Issues";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <Issues />
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
