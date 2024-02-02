import type React from "react";
import { PluginProvider } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
// import Content from "./Content"
import EntityInfo from "./EntityInfo";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <EntityInfo />
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
