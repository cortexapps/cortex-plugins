import type React from "react";
import { PluginProvider } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import Snow from "./snow";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <Snow />
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
