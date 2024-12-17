import { useCallback, useEffect, useState } from "react";
import YAML from "yaml";

import { usePluginContext } from "@cortexapps/plugin-core/components";

export interface UsePluginConfigReturn {
  isLoading: boolean;
  pluginConfig: any | null;
  savePluginConfig: (config: any) => Promise<void>;
  refreshPluginConfig: () => void;
}

export const usePluginConfig = (): UsePluginConfigReturn => {
  const { apiBaseUrl } = usePluginContext();

  const [refreshCounter, setRefreshCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pluginConfig, setPluginConfig] = useState<any | null>(null);

  useEffect(() => {
    const fetchPluginConfig = async (): Promise<void> => {
      setIsLoading(true);
      setPluginConfig(null);
      try {
        const response = await fetch(
          `${apiBaseUrl}/catalog/info-cards-plugin-config/openapi`
        );
        const config = await response.json();
        setPluginConfig(config);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchPluginConfig();
  }, [apiBaseUrl, refreshCounter]);

  const savePluginConfig = useCallback(
    async (config: any) => {
      let existingConfig: any;

      // Fetch existing config if it exists
      try {
        const r = await fetch(
          `${apiBaseUrl}/catalog/info-cards-plugin-config/openapi`
        );
        if (!r.ok) {
          throw new Error("Failed to fetch existing config");
        }
        existingConfig = await r.json();
      } catch (error) {}

      // Validate the passed in config
      if (
        !config.info?.["x-cortex-type"] ||
        config.info["x-cortex-tag"] !== "info-cards-plugin-config" ||
        config.openapi !== "3.0.1"
      ) {
        throw new Error("Invalid config");
      }

      // Preserve the existing x-cortex-type if it exists
      if (existingConfig?.info?.["x-cortex-type"]) {
        config.info["x-cortex-type"] = existingConfig.info["x-cortex-type"];
      }

      // See if the entity type exists, if not create it
      const entityType: string =
        config.info?.["x-cortex-type"] || "plugin-configuration";
      try {
        const r = await fetch(
          `${apiBaseUrl}/catalog/definitions/${entityType}`
        );
        if (!r.ok) {
          throw new Error("Failed to fetch existing entity type");
        }
      } catch (error) {
        // Create the entity type
        const entityTypeBody = {
          iconTag: "bucket",
          name: "Plugin Configuration",
          schema: { properties: {}, required: [] },
          type: "plugin-configuration",
        };
        const entityTypeResponse = await fetch(
          `${apiBaseUrl}/catalog/definitions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(entityTypeBody),
          }
        );
        if (!entityTypeResponse.ok) {
          throw new Error("Failed to create entity type");
        }
      }

      // Save the new config
      await fetch(`${apiBaseUrl}/open-api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/openapi;charset=utf-8",
        },
        body: YAML.stringify(config),
      });

      setRefreshCounter((prev) => prev + 1);
    },
    [apiBaseUrl]
  );

  const refreshPluginConfig = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  return {
    isLoading,
    pluginConfig,
    savePluginConfig,
    refreshPluginConfig,
  };
};
