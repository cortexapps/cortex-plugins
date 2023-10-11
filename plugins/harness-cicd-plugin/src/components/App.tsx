import type React from "react";
import {
  PluginProvider,
  Stack,
} from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
// import PluginContext from "./PluginContext";
import Stage from "./Stage";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <Stack>
         <Stage />
        </Stack>
       
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
