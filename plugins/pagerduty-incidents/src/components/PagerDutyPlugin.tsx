import { isEmpty, isNil } from "lodash";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { getEntityYaml } from "../api/Cortex";
import {
  Box,
  Stack,
  Title,
  usePluginContext,
} from "@cortexapps/plugin-core/components";

import { Text } from "@chakra-ui/react";

import PagerDutyIncidents from "./PagerDutyIncidents";
import PagerDutyPicker from "./PagerDutyPicker";

const PagerDutyPlugin: React.FC = () => {
  const context = usePluginContext();
  const [entityYaml, setEntityYaml] = useState<
    Record<string, any> | undefined
  >();

  const [rerender, setRerender] = useState(0);
  const forceRerender = useCallback(() => {
    setRerender((prev) => prev + 1);
  }, []);

  const fetchEntityYaml = useCallback(async () => {
    const entityTag = context.entity?.tag;

    if (!isNil(entityTag)) {
      const yaml = await getEntityYaml(context.apiBaseUrl, entityTag);
      setEntityYaml(yaml);
    }
  }, [context.apiBaseUrl, context.entity?.tag]);

  useEffect(() => {
    void fetchEntityYaml();
  }, [fetchEntityYaml, rerender]);

  return (
    <div>
      {!isEmpty(entityYaml) && (
        <Stack spacing={3}>
          <Box padding={2}>
            {isEmpty(entityYaml?.info?.["x-cortex-oncall"]?.pagerduty?.id) ? (
              <Box backgroundColor="light" padding={3} borderRadius={2}>
                <Title level={1}>PagerDuty</Title>
                <Text mb={4}>
                  This entity is not associated with any PagerDuty service. To
                  associate it with a service, select one from the dropdown
                  below.
                </Text>
                <PagerDutyPicker
                  entityYaml={entityYaml}
                  changed={forceRerender}
                />
              </Box>
            ) : (
              <PagerDutyIncidents entityYaml={entityYaml} />
            )}
          </Box>
        </Stack>
      )}
    </div>
  );
};

export default PagerDutyPlugin;
