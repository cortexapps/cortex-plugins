import type React from "react";
import { PluginProvider } from "@cortexapps/plugin-core/components";
import { ChakraProvider } from "@chakra-ui/react";

import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import PluginRoot from "./PluginRoot";
import theme from "./ui/theme";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <ChakraProvider
          theme={theme}
          toastOptions={{ defaultOptions: { position: "top" } }}
        >
          <PluginRoot />
        </ChakraProvider>
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
