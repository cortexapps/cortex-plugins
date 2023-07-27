import type React from "react";
import { PluginProvider } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
// import ErrorBoundary from "./ErrorBoundary";
import Survey from "./Survey";

const App: React.FC = () => {
  const url = new URL("https://forms.gle/kMaARQLAgJZ5C8qr9");
  url.searchParams.append("embed", "true");
  return (
    <PluginProvider>
      <Survey />
    </PluginProvider>
  );
};

export default App;
