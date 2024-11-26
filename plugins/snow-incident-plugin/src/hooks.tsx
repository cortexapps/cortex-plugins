import { useEffect, useState } from "react";

export interface UseEntityDefinitionReturn {
  entityDefinition: any;
  errorStr: string;
}

export interface UseServiceNowConfigReturn {
  snowUrl: string;
  isLoading: boolean;
  errorStr: string;
}

export interface UseServiceNowCiReturn {
  snowCi: string;
  isLoading: boolean;
}

export interface UseIncidentsReturn {
  incidents: any[];
  isLoading: boolean;
}

// Hook to fetch entity definition
export const useEntityDefinition = (
  apiBaseUrl: string,
  entityTag: string
): UseEntityDefinitionReturn => {
  const [entityDefinition, setEntityDefinition] = useState<any>(null);
  const [errorStr, setErrorStr] = useState("");

  useEffect(() => {
    if (!apiBaseUrl) {
      return;
    }

    const getEntityDefinition = async (): Promise<void> => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/catalog/${entityTag}/openapi`
        );
        const data = await response.json();
        setEntityDefinition(data);
      } catch (e) {
        setErrorStr("Failed to fetch entity definition");
      }
    };
    void getEntityDefinition();
  }, [entityTag, apiBaseUrl]);

  return { entityDefinition, errorStr };
};

// Hook to fetch ServiceNow integration config
export const useServiceNowConfig = (
  apiBaseUrl: string
): UseServiceNowConfigReturn => {
  const [snowUrl, setSnowUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorStr, setErrorStr] = useState("");

  useEffect(() => {
    if (!apiBaseUrl) {
      return;
    }

    const getSnowIntegrationConfig = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${apiBaseUrl}/catalog/servicenow-plugin-config/openapi`
        );
        const data = await response.json();
        setSnowUrl(data.info["x-cortex-definition"]["servicenow-url"]);
      } catch (e) {
        setErrorStr("instructions");
      } finally {
        if (!snowUrl) {
          setErrorStr("instructions");
        } else {
          setErrorStr("");
        }
        setIsLoading(false);
      }
    };
    void getSnowIntegrationConfig();
  }, [apiBaseUrl, snowUrl]);

  return { snowUrl, isLoading, errorStr };
};

// Hook to fetch ServiceNow CI sys_id based on entity definition or search by name/tag
export const useServiceNowCi = (
  snowUrl: string,
  entitySysId: string,
  entityName: string,
  entityTag: string
): UseServiceNowCiReturn => {
  const [snowCi, setSnowCi] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (entitySysId) {
      setSnowCi(entitySysId);
      return;
    }

    if (!snowUrl || !entityName || !entityTag) {
      return;
    }

    const searchForCI = async (): Promise<void> => {
      setIsLoading(true);
      const sysparmQuery = encodeURIComponent(
        `name=${entityName}^ORname=${entityTag}`
      );
      const url = `${snowUrl}/api/now/table/cmdb_ci_service?sysparm_query=${sysparmQuery}`;

      try {
        const result = await fetch(url);
        const data = await result.json();
        if (data.result.length > 0) {
          setSnowCi(data.result[0].sys_id);
        }
      } catch (e) {
        setSnowCi("");
      } finally {
        setIsLoading(false);
      }
    };
    void searchForCI();
  }, [snowUrl, entityName, entityTag, entitySysId]);

  return { snowCi, isLoading };
};

// Hook to fetch incidents associated with the CI
export const useIncidents = (
  snowUrl: string,
  snowCi: string
): UseIncidentsReturn => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchIncidents = async (): Promise<void> => {
      if (!snowUrl || !snowCi) return;

      setIsLoading(true);
      setIncidents([]);

      const sysparmQuery = encodeURIComponent(
        `cmdb_ci=${snowCi}^ORbusiness_service=${snowCi}^ORaffected_ci=${snowCi}^ORDERBYDESCopened_at`
      );

      try {
        const result = await fetch(
          `${snowUrl}/api/now/table/incident?sysparm_display_value=true&sysparm_query=${sysparmQuery}&sysparm_limit=50`
        );
        const data = await result.json();
        if (Array.isArray(data?.result) && data.result.length > 0) {
          setIncidents(data.result);
        }
      } catch (e) {
        console.error("Failed to fetch incidents", e);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchIncidents();
  }, [snowUrl, snowCi]);

  return { incidents, isLoading };
};
