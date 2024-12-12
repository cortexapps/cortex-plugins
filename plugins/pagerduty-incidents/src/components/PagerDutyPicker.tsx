import type React from "react";
import { useCallback, useState, useEffect, useMemo } from "react";
import "../baseStyles.css";

import { usePluginContext } from "@cortexapps/plugin-core/components";
import { Flex, Button, Select } from "@chakra-ui/react";
import { parseDocument } from "yaml";

import { usePagerDutyServices } from "../hooks/pagerDutyHooks";

import { useErrorToast, useErrorToastForResponse } from "../hooks/uiHooks";

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
  const [serviceSelectOptions, setServiceSelectOptions] = useState([] as any[]);
  const [selectedService, setSelectedService] = useState("" as any);
  const [fetchedEntityDocument, setFetchedEntityDocument] = useState(
    null as any
  );

  const errorToastForResponse = useErrorToastForResponse();
  const errorToast = useErrorToast();

  const { services, isLoading, errorMessage } = usePagerDutyServices();

  useEffect(() => {
    if (errorMessage) {
      console.error(errorMessage);
    }
  }, [errorMessage, errorToast]);

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
        errorToastForResponse(response);
        return;
      }
      changed();
    };
    void doUpdate();
  }, [
    context.apiBaseUrl,
    fetchedEntityDocument,
    selectedService,
    changed,
    errorToastForResponse,
  ]);

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
        errorToastForResponse(response);
        return;
      }
      const data = await response.text();
      const doc = parseDocument(data);
      setFetchedEntityDocument(doc);
    };
    void fetchEntity();
  }, [
    selectedService,
    context.apiBaseUrl,
    entityTag,
    errorToast,
    errorToastForResponse,
  ]);

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
