import type React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { PluginProvider } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";

import CloudForecast from "./CloudForecast";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <ChakraProvider>
          <CloudForecast />
        </ChakraProvider>
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
