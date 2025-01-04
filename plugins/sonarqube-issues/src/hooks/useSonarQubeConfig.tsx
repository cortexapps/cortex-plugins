import { useState, useEffect } from "react";
import { usePluginContext } from "@cortexapps/plugin-core/components";

export interface UseSonarQubeConfigReturn {
  baseUrl: string;
  isLoading: boolean;
}

export const useSonarQubeConfig = (): UseSonarQubeConfigReturn => {
  const context = usePluginContext();
  const [baseUrl, setBaseUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!context?.apiBaseUrl) {
      setIsLoading(false);
      return;
    }

    const fetchPluginConfig = async (): Promise<void> => {
      setIsLoading(true);
      let newBaseUrl = "https://sonarcloud.io";
      try {
        const response = await fetch(
          `${context.apiBaseUrl}/catalog/sonarqube-plugin-config/openapi`
        );
        const data = await response.json();
        const baseUrlFromEntity =
          data.info["x-cortex-definition"]["sonarqube-url"];
        if (baseUrlFromEntity) {
          newBaseUrl = baseUrlFromEntity;
        }
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
      setBaseUrl(newBaseUrl);
    };
    void fetchPluginConfig();
  }, [context?.apiBaseUrl]);
  return { baseUrl, isLoading };
};
