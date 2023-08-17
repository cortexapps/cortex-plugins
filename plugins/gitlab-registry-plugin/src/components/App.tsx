import type React from "react";
import { PluginProvider } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import Images from "./Images";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <Images />
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
