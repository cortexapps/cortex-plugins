import { isEmpty, isNil } from "lodash";
import { useCallback, useEffect, useState } from "react";
import type React from "react";
import { getEntityYaml } from "../api/Cortex";
import {
  Box,
  Stack,
  Text,
  Title,
  usePluginContext,
} from "@cortexapps/plugin-core/components";
import { getGithubDetailsFromEntity } from "../lib/parseEntity";
import GitReleases from "./GitReleases";

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

  const githubDetails = isEmpty(entityYaml)
    ? undefined
    : getGithubDetailsFromEntity(entityYaml);

  return (
    <div>
      {!isEmpty(entityYaml) && (
        <Stack spacing={3}>
          <Title level={2} noMarginBottom>
            Git info
          </Title>
          <Box backgroundColor={"gray-lighter"} padding={2}>
            <Text>{JSON.stringify(githubDetails)}</Text>
          </Box>
          {!isEmpty(githubDetails) && <GitReleases entityYaml={entityYaml} />}
        </Stack>
      )}
    </div>
  );
};

export default CortexEntity;
