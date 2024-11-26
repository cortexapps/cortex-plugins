import { useEffect, useState } from "react";
import { usePluginContext } from "@cortexapps/plugin-core/components";
import {
  type CloudForecastData,
  isCloudForecastData,
} from "./cloudForecastSchema";

export interface UseCloudForecastPluginConfig {
  isLoading: boolean;
  cloudForecastDataKey: string;
}

export const useCloudForecastPluginConfig =
  (): UseCloudForecastPluginConfig => {
    const { apiBaseUrl } = usePluginContext();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [cloudForecastDataKey, setCloudForecastDataKey] =
      useState<string>("");

    useEffect(() => {
      if (!apiBaseUrl) {
        return;
      }

      const fetchPluginConfig = async (): Promise<void> => {
        setIsLoading(true);
        let newCloudForecastDataKey = "cloudforecast";
        try {
          const response = await fetch(
            `${apiBaseUrl}/catalog/cloudforecast-plugin-config/openapi`
          );
          const data = await response.json();
          const cloudForecastDataKeyFromEntity =
            data.info["x-cortex-definition"]["cloudforecast-data-key"];
          if (cloudForecastDataKeyFromEntity) {
            newCloudForecastDataKey = cloudForecastDataKeyFromEntity;
          }
        } catch (e) {
        } finally {
          setIsLoading(false);
        }
        setCloudForecastDataKey(newCloudForecastDataKey);
      };
      void fetchPluginConfig();
    }, [apiBaseUrl]);

    return { isLoading, cloudForecastDataKey };
  };

export interface UseEntityCloudForecastDataReturn {
  isLoading: boolean;
  error: string;
  cloudForecastData: CloudForecastData | undefined;
}

export const useEntityCloudForecastData =
  (): UseEntityCloudForecastDataReturn => {
    const context = usePluginContext();
    const entityTag = context?.entity?.tag;
    const apiBaseUrl = context?.apiBaseUrl;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const { isLoading: isCloudForecastDataKeyLoading, cloudForecastDataKey } =
      useCloudForecastPluginConfig();
    const [cloudForecastData, setCloudForecastData] = useState<
      CloudForecastData | undefined
    >(undefined);

    useEffect(() => {
      setCloudForecastData(undefined);
      setError("");

      if (!entityTag || !apiBaseUrl || !cloudForecastDataKey) {
        return;
      }

      const fetchCloudForecastData = async (): Promise<void> => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `${apiBaseUrl}/catalog/${entityTag}/custom-data`
          );
          const r = await response.json();
          if (!Array.isArray(r)) {
            throw new Error("Invalid data format");
          }
          const cfItem = r.find(
            (item: any) => item.key === cloudForecastDataKey
          );
          const cloudforecast = cfItem?.value;
          if (!cloudforecast) {
            throw new Error("Data not found");
          }
          if (!isCloudForecastData(cloudforecast)) {
            throw new Error("Invalid data format");
          }
          setCloudForecastData(cloudforecast);
        } catch (e) {
          setError(e.message);
        } finally {
          setIsLoading(false);
        }
      };

      void fetchCloudForecastData();
    }, [entityTag, apiBaseUrl, cloudForecastDataKey]);

    return {
      isLoading: isLoading || isCloudForecastDataKeyLoading,
      error,
      cloudForecastData,
    };
  };
