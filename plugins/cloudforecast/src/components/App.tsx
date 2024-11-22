import type React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { PluginProvider } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";

// import { CloudForecastData } from "../cloudForecastSchema";
import CloudForecast from "./CloudForecast";

// import {
//   useEntityCloudForecastData,
// } from "../hooks";

const App: React.FC = () => {
  // const context = usePluginContext();
  // const entityTag = context?.entity?.tag;
  // const apiBaseUrl = context?.apiBaseUrl;

  // const { isLoading, error, cloudForecastData } = useEntityCloudForecastData({ entityTag, apiBaseUrl });

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
