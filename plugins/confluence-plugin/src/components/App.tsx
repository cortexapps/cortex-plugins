import type React from "react";
import {
  PluginProvider
} from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import Content from "./Content"

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <Content />
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
