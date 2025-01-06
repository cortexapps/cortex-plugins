import { useCallback, useEffect, useState, useMemo } from "react";
import YAML from "yaml";

import { usePluginContext } from "@cortexapps/plugin-core/components";

export interface UsePluginConfigReturn {
  isLoading: boolean;
  pluginConfig: any | null;
  savePluginConfig: (config: any) => Promise<void>;
  refreshPluginConfig: () => void;
  error: string | null;
}

export const usePluginConfig = (
  pluginConfigEntityTag: string
): UsePluginConfigReturn => {
  const { apiBaseUrl } = usePluginContext();

  const [refreshCounter, setRefreshCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pluginConfig, setPluginConfig] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPluginConfig = async (): Promise<void> => {
      setIsLoading(true);
      setPluginConfig(null);
      try {
        const response = await fetch(
          `${apiBaseUrl}/catalog/${pluginConfigEntityTag}/openapi`
        );
        const config = await response.json();
        setPluginConfig(config);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchPluginConfig();
  }, [apiBaseUrl, refreshCounter, pluginConfigEntityTag]);

  const savePluginConfig = useCallback(
    async (config: any) => {
      let existingConfig: any;

      // Fetch existing config if it exists
      try {
        const r = await fetch(
          `${apiBaseUrl}/catalog/${pluginConfigEntityTag}/openapi`
        );
        if (!r.ok) {
          throw new Error("Failed to fetch existing config");
        }
        existingConfig = await r.json();
      } catch (error) {
        // No existing config, not really an error
      }

      // Validate the passed in config
      if (
        !config.info?.["x-cortex-type"] ||
        config.info["x-cortex-tag"] !== pluginConfigEntityTag ||
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
    [apiBaseUrl, pluginConfigEntityTag]
  );

  const refreshPluginConfig = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  return {
    isLoading,
    pluginConfig,
    savePluginConfig,
    refreshPluginConfig,
    error,
  };
};

export interface UseCortexEntityDefinitionReturn {
  isLoading: boolean;
  entityDefinition: any | null;
  error: string | null;
}

export const useCortexEntityDefinition = (entityTag: string): any => {
  const { apiBaseUrl } = usePluginContext();

  const [isLoading, setIsLoading] = useState(true);
  const [entityDefinition, setEntityDefinition] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiBaseUrl || !entityTag) {
      setIsLoading(false);
      return;
    }

    const fetchEntityDefinition = async (): Promise<void> => {
      setIsLoading(true);
      setEntityDefinition(null);
      try {
        const response = await fetch(
          `${apiBaseUrl}/catalog/${entityTag}/openapi`
        );
        const definition = await response.json();
        setEntityDefinition(definition);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchEntityDefinition();
  }, [apiBaseUrl, entityTag]);

  return {
    isLoading,
    entityDefinition,
    error,
  };
};

export interface UseConfluencePageContentReturn {
  isLoading: boolean;
  contents: Record<string, any>;
}

export const useConfluencePageContent = (
  pages: EntityPageI[]
): UseConfluencePageContentReturn => {
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [contents, setContents] = useState<Record<string, object>>({});

  const { isLoading: isPluginConfigLoading, pluginConfig } = usePluginConfig(
    "confluence-plugin-config"
  );

  const baseConfluenceUrl = useMemo((): string => {
    return (
      pluginConfig?.info?.["x-cortex-definition"]?.["confluence-url"] ?? ""
    );
  }, [pluginConfig]);

  const isLoading = useMemo(
    () => isPluginConfigLoading || isContentLoading,
    [isPluginConfigLoading, isContentLoading]
  );

  useEffect(() => {
    if (!baseConfluenceUrl || pages.length === 0) {
      setIsContentLoading(false);
      return;
    }
    const fetchPageContents = async (): Promise<void> => {
      setIsContentLoading(true);
      for (const page of pages) {
        try {
          const response = await fetch(
            `${baseConfluenceUrl}/wiki/api/v2/pages/${
              page.id as string
            }?body-format=styled_view`
          );
          const content = await response.json();
          if (content.title && content.body?.styled_view?.value) {
            setContents((prev) => ({
              ...prev,
              [page.id]: {
                title: content.title,
                body: content.body.styled_view.value,
              },
            }));
          } else if (content.errors) {
            setContents((prev) => ({
              ...prev,
              [page.id]: {
                title: `Error loading page ${page.id}`,
                errors: content.errors,
              },
            }));
          }
        } catch (error) {
          console.error(error);
        }
      }
      setIsContentLoading(false);
    };
    void fetchPageContents();
  }, [pages, baseConfluenceUrl]);

  return {
    isLoading,
    contents,
  };
};
