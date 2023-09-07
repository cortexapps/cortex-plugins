import {
  type CortexDomain,
  type CortexResource,
  type CortexService,
} from "@cortexapps/plugin-core";
import React from "react";
import { useAsync } from "react-use";
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
  const [entityYaml, setEntityYaml] = React.useState<
    Record<string, any> | undefined
  >();
  const { loading: isLoading } = useAsync(async () => {
    const yaml = await getEntityYaml(entity.tag);
    setEntityYaml(yaml);
  });

  return (
    <EntityYamlContext.Provider value={{ entityYaml, isLoading }}>
      {children}
    </EntityYamlContext.Provider>
  );
};

export default EntityYamlProvider;
