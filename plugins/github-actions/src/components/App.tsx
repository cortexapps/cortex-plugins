import type React from "react";
import {
  PluginContextProvider,
  ThemeProvider,
} from "@cortexapps/plugin-core/components";
import { lightTheme } from "@backstage/theme";
import { ThemeProvider as MaterialThemeProvider } from "@material-ui/core";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import EntityYamlContainer from "./EntityYamlContainer";
import { MemoryRouter } from "react-router-dom";

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
