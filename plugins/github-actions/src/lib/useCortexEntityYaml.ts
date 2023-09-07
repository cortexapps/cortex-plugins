import { isNil } from "lodash";
import { useContext, useState } from "react";
import { getEntityYaml } from "../api/Cortex";
import { useAsync } from "react-use";
import { EntityYamlContext } from "../components/EntityYamlProvider";
import { usePluginContext } from "@cortexapps/plugin-core/components";
import {
  type CortexDomain,
  type CortexResource,
  type CortexService,
} from "@cortexapps/plugin-core/*";

/**
 * Returns the entity YAML for the current entity from context.
 */
export const useEntityYaml = (): { entityYaml?: Record<string, any> } => {
  const { entityYaml } = useContext(EntityYamlContext);

  return { entityYaml };
};

/**
 * Loads and returns the entity YAML for the current entity.
 */
const useCortexEntityYaml = (): {
  entity: CortexDomain | CortexService | CortexResource | null;
  entityYaml?: Record<string, any>;
  isLoading: boolean;
} => {
  const [entityYaml, setEntityYaml] = useState<
    Record<string, any> | undefined
  >();

  const context = usePluginContext();

  const { loading: isLoadingYaml } = useAsync(async () => {
    const entityTag = context?.entity?.tag;
    if (!isNil(entityTag)) {
      const yaml = await getEntityYaml(entityTag);
      setEntityYaml(yaml);
    }
  }, [context]);

  return {
    entity: context?.entity,
    entityYaml,
    isLoading: isLoadingYaml,
  };
};

export default useCortexEntityYaml;
