import type React from "react";
import {

  PluginProvider
} from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import Attestation from "./Attestation";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <Attestation />
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
