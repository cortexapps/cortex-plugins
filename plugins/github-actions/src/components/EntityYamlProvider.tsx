import React from "react";
import { useAsync } from "react-use";
import {
  type CortexDomain,
  type CortexResource,
  type CortexService,
} from "@cortexapps/plugin-core";
import { usePluginContext } from "@cortexapps/plugin-core/components";
import { getEntityYaml } from "../api/Cortex";

interface PluginContextProviderProps extends React.PropsWithChildren {
  entity: CortexDomain | CortexResource | CortexService;
}

interface IEntityYamlContext {
  entityYaml?: Record<string, any>;
  isLoading: boolean;
}

export const EntityYamlContext = React.createContext<IEntityYamlContext>({
  isLoading: true,
});

const EntityYamlProvider: React.FC<PluginContextProviderProps> = ({
  children,
  entity,
}) => {
  const { apiBaseUrl } = usePluginContext();

  const { value: entityYaml, loading: isLoading } = useAsync(async () => {
    const yaml = await getEntityYaml(apiBaseUrl, entity.tag);
    return yaml as Record<string, any>;
  });

  return (
    <EntityYamlContext.Provider value={{ entityYaml, isLoading }}>
      {children}
    </EntityYamlContext.Provider>
  );
};

export default EntityYamlProvider;
