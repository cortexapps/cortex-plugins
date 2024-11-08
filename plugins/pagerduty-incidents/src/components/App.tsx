import type React from "react";
import { PluginProvider } from "@cortexapps/plugin-core/components";
import { ChakraProvider } from "@chakra-ui/react";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import PagerDutyPlugin from "./PagerDutyPlugin";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <ChakraProvider>
          <PagerDutyPlugin />
        </ChakraProvider>
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
