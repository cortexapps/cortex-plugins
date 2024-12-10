import type React from "react";
import { PluginProvider } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import PluginRoot from "./PluginRoot";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <PluginRoot />
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
