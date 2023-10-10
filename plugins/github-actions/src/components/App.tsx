import type React from "react";
import { MemoryRouter } from "react-router-dom";
import {
  PluginContextProvider,
  ThemeProvider,
} from "@cortexapps/plugin-core/components";
import { lightTheme } from "@backstage/theme";
import { ThemeProvider as MaterialThemeProvider } from "@material-ui/core";
import ErrorBoundary from "./ErrorBoundary";
import EntityYamlContainer from "./EntityYamlContainer";
import "../baseStyles.css";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <MaterialThemeProvider theme={lightTheme}>
          <PluginContextProvider>
            <MemoryRouter>
              <EntityYamlContainer />
            </MemoryRouter>
          </PluginContextProvider>
        </MaterialThemeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
