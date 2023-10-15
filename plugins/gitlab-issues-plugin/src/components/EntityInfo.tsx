import { isEmpty, isNil } from "lodash";
import { useCallback, useEffect, useState } from "react";
import type React from "react";
import { getEntityYaml } from "../api/Cortex";
import {
  Box,
  Stack,
  Text,
  usePluginContext,
} from "@cortexapps/plugin-core/components";
import { getGitLabDetailsFromEntity } from "../lib/parseEntity";
import Issues from "./Issues";

const CortexEntity: React.FC = () => {
  const context = usePluginContext();
  const [entityYaml, setEntityYaml] = useState<
    Record<string, any> | undefined
  >();

  const fetchEntityYaml = useCallback(async () => {
    const entityTag = context.entity?.tag;

    if (!isNil(entityTag)) {
      const yaml = await getEntityYaml(context.apiBaseUrl, entityTag);
      setEntityYaml(yaml);
    }
  }, [context.apiBaseUrl, context.entity?.tag]);

  useEffect(() => {
    void fetchEntityYaml();
  }, [fetchEntityYaml]);

  const gitlabDetails = isEmpty(entityYaml)
    ? undefined
    : getGitLabDetailsFromEntity(entityYaml);

  return (
    <div>
      {!isEmpty(entityYaml) && (
        <Stack spacing={3}>
          <Box padding={2}>
            {isEmpty(gitlabDetails) ? (
              <Box backgroundColor="light" padding={3} borderRadius={2}>
                <Text>No GitHub details were found for this entity</Text>
              </Box>
            ) : (
              <Issues entityYaml={entityYaml} />
            )}
          </Box>
        </Stack>
      )}
    </div>
  );
};

export default CortexEntity;
