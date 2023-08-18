import type React from "react";
import { PluginProvider } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import Changes from "./Changes";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <Changes />
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
