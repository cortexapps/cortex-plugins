import { Title, usePluginContext } from "@cortexapps/plugin-core/components";
import type React from "react";

const PluginContext: React.FC = () => {
  const context = usePluginContext();

  return (
    <>
      <Title level={2}>Plugin context</Title>
      <pre>{JSON.stringify(context, null, 2)}</pre>
    </>
  );
};

export default PluginContext;
