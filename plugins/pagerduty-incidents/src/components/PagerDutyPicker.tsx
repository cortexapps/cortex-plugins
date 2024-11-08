import type React from "react";
import { useCallback, useState, useEffect, useMemo } from "react";
import "../baseStyles.css";

import { usePluginContext } from "@cortexapps/plugin-core/components";

import { Flex, Button, Select } from "@chakra-ui/react";

import {
  // Document,
  parseDocument,
} from "yaml";

interface PagerDutyPickerProps {
  entityYaml: Record<string, any>;
  changed: () => void;
}

const PagerDutyPicker: React.FC<PagerDutyPickerProps> = ({ changed }) => {
  const context = usePluginContext();
  const entityTag: string = useMemo(
    () => context.entity?.tag ?? "",
    [context.entity?.tag]
  );
  const [services, setServices] = useState([] as any[]);
  const [serviceSelectOptions, setServiceSelectOptions] = useState([] as any[]);
  const [selectedService, setSelectedService] = useState("" as any);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedEntityDocument, setFetchedEntityDocument] = useState(
    null as any
  );

  const updateEntity = useCallback((): void => {
    const doUpdate = async (): Promise<void> => {
      const newDoc = fetchedEntityDocument.clone();
      const info = newDoc.get("info");
      info.set("x-cortex-oncall", {
        pagerduty: {
          id: selectedService,
          type: "SERVICE",
        },
      });

      const url = `${context.apiBaseUrl}/open-api`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/openapi;charset=utf-8",
        },
        body: newDoc.toString(),
      });
      if (!response.ok) {
        console.error(`HTTP Error ${response.status}: ${response.statusText}`);
        return;
      }
      changed();
    };
    void doUpdate();
  }, [context.apiBaseUrl, fetchedEntityDocument, selectedService, changed]);

  useEffect(() => {
    const fetchServices = async (): Promise<void> => {
      setIsLoading(true);
      let more = false;
      let offset = 0;
      const limit = 25;
      let services: any[] = [];
      do {
        // Fetch services
        const url = `https://api.pagerduty.com/services?limit=${limit}&offset=${offset}`;
        const response = await fetch(url, {
          headers: {
            Accept: "application/vnd.pagerduty+json;version=2",
          },
        });
        if (!response.ok) {
          console.error(
            `HTTP Error ${response.status}: ${response.statusText}`
          );
          return;
        }
        const data = await response.json();
        if (!data.services) {
          console.error("No services found in response");
          return;
        }
        more = data.more;
        offset += limit;
        services = services.concat(data.services);
      } while (more);
      setServices(services);
      setIsLoading(false);
    };
    void fetchServices();
  }, []);

  useEffect(() => {
    setServiceSelectOptions(
      services.map((service) => ({
        key: service.id,
        label: service.name,
      }))
    );
  }, [services]);

  useEffect(() => {
    if (!entityTag || !context?.apiBaseUrl) {
      return;
    }
    const fetchEntity = async (): Promise<void> => {
      const url = `${context.apiBaseUrl}/catalog/${entityTag}/openapi?yaml=true`;
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`HTTP Error ${response.status}: ${response.statusText}`);
        return;
      }
      const data = await response.text();
      const doc = parseDocument(data);
      setFetchedEntityDocument(doc);
    };
    void fetchEntity();
  }, [selectedService, context.apiBaseUrl, entityTag]);

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>): void => {
      setSelectedService(e.target.value);
    },
    []
  );

  return (
    <div>
      <Flex>
        <Select
          name="service"
          id="service"
          placeholder={
            isLoading
              ? "Loading..."
              : services.length > 0
              ? "Select a service"
              : "No services found"
          }
          value={selectedService}
          onChange={handleSelectChange}
        >
          {serviceSelectOptions?.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
          {!serviceSelectOptions && <option value="">Loading...</option>}
        </Select>
        <Button
          px={2}
          ml={2}
          minW={"fit-content"}
          colorScheme="blue"
          isDisabled={!selectedService}
          onClick={updateEntity}
        >
          Map to PagerDuty
        </Button>
      </Flex>
    </div>
  );
};

export default PagerDutyPicker;
