import type React from "react";
import { PluginProvider } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import PageContent from "./PageContent";
import { ChakraProvider } from "@chakra-ui/react";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <ChakraProvider toastOptions={{ defaultOptions: { position: "top" } }}>
          <PageContent />
        </ChakraProvider>
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
