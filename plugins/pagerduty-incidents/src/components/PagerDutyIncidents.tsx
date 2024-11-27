import type React from "react";
import { useMemo } from "react";
import { SimpleTable, Title, Loader } from "@cortexapps/plugin-core/components";

import { Avatar, AvatarGroup, Badge, Box, Text } from "@chakra-ui/react";

import {
  usePagerDutyService,
  usePagerDutyIncidents,
  usePagerDutyOnCalls,
} from "../hooks/pagerDutyHooks";
import OnCallBadges from "./OnCallBadges";
import "../baseStyles.css";

interface PagerDutyIncidentsProps {
  entityYaml: Record<string, any>;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const color =
    status === "resolved"
      ? "green"
      : status === "acknowledged"
      ? "yellow"
      : "red";
  return (
    <Badge p={1} colorScheme={color} variant="subtle">
      {status}
    </Badge>
  );
};

const UrgencyBadge: React.FC<{ urgency: string }> = ({ urgency }) => {
  const variant = urgency === "high" ? "solid" : "subtle";
  return (
    <Badge p={1} variant={variant}>
      {urgency}
    </Badge>
  );
};

const PagerDutyIncidents: React.FC<PagerDutyIncidentsProps> = ({
  entityYaml,
}) => {
  const pdId: string = useMemo(
    () => entityYaml?.info?.["x-cortex-oncall"]?.pagerduty?.id || "",
    [entityYaml?.info]
  );
  const pdType: string = useMemo(
    () => entityYaml?.info?.["x-cortex-oncall"]?.pagerduty?.type || "",
    [entityYaml?.info]
  );

  const {
    service,
    isLoading: serviceLoading,
    errorMessage: serviceError,
  } = usePagerDutyService(pdId, pdType);
  const {
    incidents,
    isLoading: incidentsLoading,
    errorMessage: incidentsError,
  } = usePagerDutyIncidents(pdId, pdType);
  const {
    oncalls,
    isLoading: onCallsLoading,
    errorMessage: onCallsError,
  } = usePagerDutyOnCalls(service);

  const isLoading = serviceLoading || incidentsLoading || onCallsLoading;
  const errorMessage = serviceError || incidentsError || onCallsError;

  const config = {
    columns: [
      {
        Cell: (createdAt: string) => (
          <Box>
            <Text as="span" display="inline-block" verticalAlign="middle">
              {new Date(createdAt).toLocaleString()}
            </Text>
          </Box>
        ),
        accessor: "created_at",
        id: "created_at",
        title: "Created At",
        width: "content",
      },
      {
        Cell: (urgency: string) => (
          <Box>
            <UrgencyBadge urgency={urgency} />
          </Box>
        ),
        accessor: "urgency",
        id: "urgency",
        title: "Urgency",
        width: "auto",
      },
      {
        Cell: (status: string) => (
          <Box>
            <StatusBadge status={status} />
          </Box>
        ),
        accessor: "status",
        id: "status",
        title: "Status",
        width: "auto",
      },
      {
        Cell: (incident: any) => (
          <Box>
            <Text as="span" display="inline-block" verticalAlign="middle">
              <a href={incident.html_url} target="_blank" rel="noreferrer">
                {incident.title}
              </a>
            </Text>
          </Box>
        ),
        id: "summary",
        title: "Summary",
        width: "auto",
      },
      {
        Cell: (incident: any) => {
          const assignees = incident.assignments.map((assignment: any) => (
            <Avatar
              key={assignment.assignee.id}
              name={assignment.assignee.summary}
              src={assignment.assignee.avatar_url}
              size="sm"
              mr={2}
              onClick={() => {
                window.open(assignment.assignee.html_url, "_blank");
              }}
              cursor={"pointer"}
              getInitials={(name) => {
                const allNames = name.trim().split(" ");
                const firstInitial = allNames[0].match(/./u)?.toString();
                const lastInitial = allNames[allNames.length - 1]
                  .match(/./u)
                  ?.toString();
                return `${firstInitial ?? ""}${lastInitial ?? ""}`;
              }}
            />
          ));
          return (
            <Box>
              <AvatarGroup size="sm" max={3}>
                {assignees}
              </AvatarGroup>
            </Box>
          );
        },
        id: "assignees",
        title: "Assignees",
      },
    ],
  };

  if (isLoading) {
    return <Loader />;
  }

  if (errorMessage) {
    return (
      <Box bg="blackAlpha.50" padding={3} borderRadius="md">
        <Text>{errorMessage}</Text>
      </Box>
    );
  }

  return (
    <Box bg="blackAlpha.50" padding={3} borderRadius="md">
      <Title noMarginBottom level={1}>
        PagerDuty Service{" "}
        <a href={service?.html_url} target="_blank" rel="noreferrer">
          {service?.name}
        </a>
      </Title>
      <OnCallBadges oncalls={oncalls} /> {/* Use the new component */}
      {incidents.length > 0 ? (
        <>
          <Text mt={2} mb={0} fontSize="md" fontWeight="bold">
            Recent Incidents
          </Text>
          <SimpleTable config={config} items={incidents} />
        </>
      ) : (
        <Text>🎉 No incidents 🎉</Text>
      )}
    </Box>
  );
};

export default PagerDutyIncidents;
