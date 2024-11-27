import { isEmpty, isNil } from "lodash";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { getEntityYaml } from "../api/Cortex";
import {
  Box,
  Stack,
  Title,
  Link,
  Loader,
  usePluginContext,
} from "@cortexapps/plugin-core/components";

import { Text } from "@chakra-ui/react";

import { isPagerDutyConfigured } from "../hooks/pagerDutyHooks";

import PagerDutyIncidents from "./PagerDutyIncidents";
import PagerDutyPicker from "./PagerDutyPicker";
import Instructions from "./Instructions";

const PagerDutyPlugin: React.FC = () => {
  const context = usePluginContext();
  const [entityYaml, setEntityYaml] = useState<
    Record<string, any> | undefined
  >();

  const isConfigured = isPagerDutyConfigured();

  const [hasGitops, setHasGitops] = useState<boolean | null>(null);
  useEffect(() => {
    if (!context?.entity?.tag || !context?.apiBaseUrl) {
      return;
    }
    const fetchGitopsLogs = async (): Promise<void> => {
      try {
        const entityTag: string = context.entity?.tag ?? "";
        const response = await fetch(
          `${context.apiBaseUrl}/catalog/${entityTag}/gitops-logs`
        );
        if (response.ok) {
          setHasGitops(true);
        } else {
          setHasGitops(false);
        }
      } catch (e) {
        setHasGitops(false);
      }
    };
    void fetchGitopsLogs();
  }, [context.entity?.tag, context.apiBaseUrl]);

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

  if (isConfigured === null) {
    return <Loader />;
  }

  if (isConfigured === false) {
    return <Instructions />;
  }

  return (
    <div>
      {!isEmpty(entityYaml) && (
        <Stack spacing={3}>
          <Box padding={2}>
            {isEmpty(entityYaml?.info?.["x-cortex-oncall"]?.pagerduty?.id) ? (
              <Box backgroundColor="light" padding={3} borderRadius={2}>
                <Title level={1}>PagerDuty</Title>
                {hasGitops === false && (
                  <>
                    <Text mb={4}>
                      This entity is not associated with any PagerDuty service.
                      To associate it with a service, select one from the
                      dropdown below.
                    </Text>
                    <PagerDutyPicker
                      entityYaml={entityYaml}
                      changed={forceRerender}
                    />
                  </>
                )}
                {hasGitops === true && (
                  <Text>
                    This entity is managed by GitOps. To associate it with a
                    PagerDuty service, update the entity's YAML file in Git, as
                    described in the{" "}
                    <Link
                      href="https://docs.cortex.dev/guides/alerting/pagerduty"
                      target="_blank"
                    >
                      documentation
                    </Link>
                    .
                  </Text>
                )}
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
