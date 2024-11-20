import { useState, useEffect } from "react";
import { usePluginContext } from "@cortexapps/plugin-core/components";
import { useToast } from "@chakra-ui/react";

const getErrorMessageFromResponse = async (
  response: Response
): Promise<string> => {
  if (response.headers.get("Content-Type")?.includes("application/json")) {
    try {
      const json = await response.json();
      return json.message || response.statusText || response.status.toString();
    } catch (e) {
      return response.statusText || response.status.toString();
    }
  }
  return response.statusText || response.status.toString();
};

export interface UseSonarQubeConfigReturn {
  baseUrl: string;
  isLoading: boolean;
}

export interface UseSonarQubeIssuesReturn {
  issues: any[];
  hasIssues: boolean;
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

export const useSonarQubeIssues = (
  baseUrl: string,
  project: string
): UseSonarQubeIssuesReturn => {
  const [issues, setIssues] = useState([]);
  const [hasIssues, setHasIssues] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (!project || !baseUrl) {
      setIsLoading(false);
      return;
    }

    const fetchIssues = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const issueUrl = `${baseUrl}/api/issues/search?componentKeys=${project}&resolved=false&s=CREATION_DATE&asc=false`;
        const response = await fetch(issueUrl);
        if (!response.ok) {
          throw new Error(await getErrorMessageFromResponse(response));
        }
        const data = await response.json();

        if (data.issues instanceof Array && data.issues.length > 0) {
          setIssues(data.issues);
          setHasIssues(true);
        }
      } catch (err) {
        const msg: string = err.message || err.toString();
        toast({
          title: `Failed to fetch issues: ${msg}`,
          status: "error",
          duration: null,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    void fetchIssues();
  }, [baseUrl, project, toast]);

  return { issues, hasIssues, isLoading };
};
