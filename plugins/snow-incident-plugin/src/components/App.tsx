import type React from "react";
import { PluginProvider } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import Incidents from "./Incidents";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <Incidents />
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
