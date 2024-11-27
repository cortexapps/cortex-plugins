import { useState, useEffect } from "react";
import { useErrorToastForResponse } from "./uiHooks";

export interface UsePagerDutyServicesReturn {
  services: Array<Record<string, any>>;
  isLoading: boolean;
  errorMessage: string;
}

export interface UsePagerDutyServiceReturn {
  service: Record<string, any>;
  isLoading: boolean;
  errorMessage: string;
}

export interface UsePagerDutyIncidentsReturn {
  incidents: Array<Record<string, any>>;
  isLoading: boolean;
  errorMessage: string;
}

export interface UsePagerDutyOnCallsReturn {
  oncalls: Array<Record<string, any>>;
  isLoading: boolean;
  errorMessage: string;
}

export const isPagerDutyTokenValid = (token: string): boolean => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    const checkPagerDutyAbilities = async (): Promise<void> => {
      try {
        const response = await fetch(`https://api.pagerduty.com/abilities`, {
          headers: {
            Authorization: `Token token=${token}`,
          },
        });

        if (response.ok) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (e) {
        setIsValid(false);
      }
    };

    void checkPagerDutyAbilities();
  }, [token]);

  return isValid;
}

export const isPagerDutyConfigured = (): boolean | null => {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPagerDutyAbilities = async (): Promise<void> => {
      try {
        const response = await fetch(`https://api.pagerduty.com/abilities`);

        if (response.ok) {
          setIsConfigured(true);
        } else {
          setIsConfigured(false);
        }
      } catch (e) {
        setIsConfigured(false);
      }
    };

    void checkPagerDutyAbilities();
  }, []);

  return isConfigured;
}

export const usePagerDutyServices = (): UsePagerDutyServicesReturn => {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const errorToastForResponse = useErrorToastForResponse();

  useEffect(() => {
    const fetchServices = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage("");
      let more = false;
      let offset = 0;
      const limit = 25;
      let allServices: any[] = [];

      try {
        do {
          const url = `https://api.pagerduty.com/services?limit=${limit}&offset=${offset}`;
          const response = await fetch(url, {
            headers: {
              Accept: "application/vnd.pagerduty+json;version=2",
            },
          });

          if (!response.ok) {
            errorToastForResponse(response);
            throw new Error(`HTTP Error ${response.status}`);
          }

          const data = await response.json();
          allServices = allServices.concat(data.services || []);
          more = data.more || false;
          offset += limit;
        } while (more);

        setServices(allServices);
      } catch (err: any) {
        const msg: string = err.message || "Unknown error";
        setErrorMessage(`Error fetching PagerDuty services: ${msg}`);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchServices();
  }, [errorToastForResponse]);

  return { services, isLoading, errorMessage };
};

export const usePagerDutyService = (
  pdId: string,
  pdType: string
): UsePagerDutyServiceReturn => {
  const [service, setService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const errorToastForResponse = useErrorToastForResponse();

  useEffect(() => {
    const fetchService = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage("");

      if (!pdId || pdType !== "SERVICE") {
        setErrorMessage(
          "This entity is not associated with a PagerDuty service"
        );
        setIsLoading(false);
        return;
      }

      try {
        const url = `https://api.pagerduty.com/services/${pdId}`;
        const response = await fetch(url, {
          headers: {
            Accept: "application/vnd.pagerduty+json;version=2",
          },
        });

        if (!response.ok) {
          errorToastForResponse(response);
          throw new Error(
            `HTTP Error ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        if (data.service) {
          setService(data.service);
        } else {
          setErrorMessage("No PagerDuty service was found for this entity");
        }
      } catch (err: any) {
        const msg: string = err.message || "Unknown error";
        setErrorMessage(`Error fetching PagerDuty service: ${msg}`);
      }

      setIsLoading(false);
    };

    void fetchService();
  }, [pdId, pdType, errorToastForResponse]);

  return { service, isLoading, errorMessage };
};

export const usePagerDutyIncidents = (
  pdId: string,
  pdType: string
): UsePagerDutyIncidentsReturn => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const errorToastForResponse = useErrorToastForResponse();

  useEffect(() => {
    if (!pdId || pdType !== "SERVICE") return;

    const fetchIncidents = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const url = `https://api.pagerduty.com/incidents`;
        const params = new URLSearchParams();
        params.append("service_ids[]", pdId);
        params.append("statuses[]", "triggered");
        params.append("statuses[]", "acknowledged");
        params.append("statuses[]", "resolved");
        params.append("limit", "20");
        params.append("sort_by", "created_at:desc");

        const response = await fetch(`${url}?${params.toString()}`, {
          headers: {
            Accept: "application/vnd.pagerduty+json;version=2",
          },
        });

        if (!response.ok) {
          errorToastForResponse(response);
          throw new Error(
            `HTTP Error ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        if (Array.isArray(data.incidents) && data.incidents.length > 0) {
          setIncidents(data.incidents);
        } else {
          setIncidents([]);
        }
      } catch (err: any) {
        const msg: string = err.message || "Unknown error";
        setErrorMessage(`Error fetching PagerDuty incidents: ${msg}`);
      }

      setIsLoading(false);
    };

    void fetchIncidents();
  }, [pdId, pdType, errorToastForResponse]);

  return { incidents, isLoading, errorMessage };
};

export const usePagerDutyOnCalls = (
  service: any
): UsePagerDutyOnCallsReturn => {
  const [oncalls, setOncalls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const errorToastForResponse = useErrorToastForResponse();

  useEffect(() => {
    if (!service) return;

    const fetchOnCalls = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const url = `https://api.pagerduty.com/oncalls`;
        const params = new URLSearchParams();
        params.append("escalation_policy_ids[]", service.escalation_policy.id);

        const response = await fetch(`${url}?${params.toString()}`, {
          headers: {
            Accept: "application/vnd.pagerduty+json;version=2",
          },
        });

        if (!response.ok) {
          errorToastForResponse(response);
          throw new Error(
            `HTTP Error ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        if (Array.isArray(data.oncalls) && data.oncalls.length > 0) {
          setOncalls(data.oncalls);
        } else {
          setErrorMessage("No PagerDuty oncalls were found for this entity");
        }
      } catch (err: any) {
        const msg: string = err.message || "Unknown error";
        setErrorMessage(`Error fetching PagerDuty oncalls: ${msg}`);
      }

      setIsLoading(false);
    };

    void fetchOnCalls();
  }, [service, errorToastForResponse]);

  return { oncalls, isLoading, errorMessage };
};
