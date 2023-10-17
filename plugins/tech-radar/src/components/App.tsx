import type React from "react";
import {
  Logo,
  PluginProvider,
  Title,
} from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import ErrorBoundary from "./ErrorBoundary";
import TechRadar from "./TechRadar";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PluginProvider>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Logo />
          <Title
            style={{ marginBottom: 0, marginTop: 1, marginLeft: 6 }}
            level={1}
          >
            Tech Radar
          </Title>
        </div>

        <TechRadar />
      </PluginProvider>
    </ErrorBoundary>
  );
};

export default App;
