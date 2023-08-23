import { isNil } from "lodash";
import { useCallback, useEffect, useState } from "react";
import type React from "react";
import { getCortexContext, getEntityYaml } from "../api/Cortex";
import { Box, Stack, Text, Title } from "@cortexapps/plugin-core/components";
import { getGithubDetailsFromEntity } from "../lib/parseEntity";
import GitReleases from "./GitReleases";

const CortexEntity: React.FC = () => {
  const [entityYaml, setEntityYaml] = useState<
    Record<string, any> | undefined
  >();

  const fetchEntityYaml = useCallback(async () => {
    const context = await getCortexContext();
    const entityTag = context?.entity?.tag;
    if (!isNil(entityTag)) {
      const yaml = await getEntityYaml(entityTag);
      setEntityYaml(yaml);
    }
  }, []);

  useEffect(() => {
    void fetchEntityYaml();
  }, [fetchEntityYaml]);

  return (
    <div>
      {Boolean(entityYaml) && (
        <Stack spacing={3}>
          <Title level={2} noMarginBottom>
            Git info
          </Title>
          <Box backgroundColor={"gray-lighter"} padding={2}>
            <Text>
              {JSON.stringify(
                getGithubDetailsFromEntity(entityYaml as Record<string, any>)
              )}
            </Text>
          </Box>
          <GitReleases entityYaml={entityYaml as Record<string, any>} />
        </Stack>
      )}
    </div>
  );
};

export default CortexEntity;
