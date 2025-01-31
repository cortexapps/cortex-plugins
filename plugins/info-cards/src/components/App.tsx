import type React from "react";
import { PluginProvider } from "@cortexapps/plugin-core/components";
import { ChakraProvider } from "@chakra-ui/react";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import PluginRoot from "./PluginRoot";
import theme from "./ui/theme";

const App: React.FC = () => {
  const queryClient = new QueryClient();
  return (
    <ErrorBoundary>
      <PluginProvider>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider
            theme={theme}
            toastOptions={{ defaultOptions: { position: "top" } }}
          >
            <PluginRoot />
            {/* ReactQueryDevTools will only show in dev server */}
            <ReactQueryDevtools initialIsOpen={false} />
          </ChakraProvider>
        </QueryClientProvider>
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
