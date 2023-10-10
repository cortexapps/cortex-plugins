import type React from "react";
import { PluginProvider } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import Survey from "./Survey";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <Survey />
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
