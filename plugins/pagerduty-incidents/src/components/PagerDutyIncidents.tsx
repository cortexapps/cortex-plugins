import React, { useState, useEffect, useMemo } from "react";
import { PluginContextLocation } from "@cortexapps/plugin-core";
import {
  SimpleTable,
  // Text,
  Title,
  Loader,
  usePluginContext,
} from "@cortexapps/plugin-core/components";

import {
  Avatar,
  AvatarGroup,
  Box,
  Badge,
  Flex,
  // Center,
  Text,
} from "@chakra-ui/react";

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
  const [hasIncidents, setHasIncidents] = useState(false);
  const context = usePluginContext();

  const [service, setService] = useState(null as any);
  const [oncalls, setOncalls] = useState([]);

  const [incidents, setIncidents] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(
    context.location === PluginContextLocation.Entity
  );

  const [errorMessage, setErrorMessage] = React.useState("");

  const pdId: string = useMemo(
    () => entityYaml?.info?.["x-cortex-oncall"]?.pagerduty?.id || "",
    [entityYaml?.info]
  );
  const pdType: string = useMemo(
    () => entityYaml?.info?.["x-cortex-oncall"]?.pagerduty?.type || "",
    [entityYaml?.info]
  );

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

        const response: Response = await fetch(url);
        if (!response.ok) {
          setIsLoading(false);
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
      } catch (err) {
        const errMsg: string = err.message || "Unknown error";
        setErrorMessage(`Error fetching PagerDuty service: ${errMsg}`);
      }
      setIsLoading(false);
    };
    void fetchService();
  }, [pdId, pdType]);

  useEffect(() => {
    if (!pdId || pdType !== "SERVICE") {
      return;
    }
    const fetchIncidents = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const url: string = `https://api.pagerduty.com/incidents`;

        const params = new URLSearchParams();
        params.append("service_ids[]", pdId);
        params.append("statuses[]", "triggered");
        params.append("statuses[]", "acknowledged");
        params.append("statuses[]", "resolved");
        params.append("limit", "20");
        params.append("sort_by", "created_at:desc");

        const response: Response = await fetch(`${url}?${params.toString()}`, {
          headers: {
            Accept: "application/vnd.pagerduty+json;version=2",
          },
        });
        if (!response.ok) {
          setIsLoading(false);
          throw new Error(
            `HTTP Error ${response.status}: ${response.statusText}`
          );
        }
        const data = await response.json();
        if (data.incidents instanceof Array && data.incidents.length > 0) {
          setHasIncidents(true);
          setErrorMessage("");
          const sortedIncidentsByDateDesc = data.incidents.sort(
            (a: any, b: any) => {
              return (
                new Date(b.created_at).getMilliseconds() -
                new Date(a.created_at).getMilliseconds()
              );
            }
          );
          setIncidents(sortedIncidentsByDateDesc);
        } else {
          setErrorMessage("No PagerDuty incidents were found for this entity");
        }
      } catch (err) {
        const errMsg: string = err.message || "Unknown error";
        setErrorMessage(`Error fetching PagerDuty incidents: ${errMsg}`);
      }
      setIsLoading(false);
    };
    void fetchIncidents();
  }, [pdId, pdType]);

  useEffect(() => {
    if (!service) {
      return;
    }
    const fetchOncalls = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const url = `https://api.pagerduty.com/oncalls`;

        const params = new URLSearchParams();
        params.append("escalation_policy_ids[]", service.escalation_policy.id);

        const response: Response = await fetch(`${url}?${params.toString()}`, {
          headers: {
            Accept: "application/vnd.pagerduty+json;version=2",
          },
        });
        if (!response.ok) {
          setIsLoading(false);
          throw new Error(
            `HTTP Error ${response.status}: ${response.statusText}`
          );
        }
        const data = await response.json();
        if (data.oncalls instanceof Array && data.oncalls.length > 0) {
          setOncalls(data.oncalls);
        } else {
          setErrorMessage("No PagerDuty oncalls were found for this entity");
        }
      } catch (err) {
        const errMsg: string = err.message || "Unknown error";
        setErrorMessage(`Error fetching PagerDuty oncalls: ${errMsg}`);
      }
      setIsLoading(false);
    };
    void fetchOncalls();
  }, [service]);

  const onCallBadges = useMemo(() => {
    if (!oncalls || oncalls.length === 0) {
      return [];
    }
    const mapByLevel = {};
    oncalls.forEach((oncall: any) => {
      if (!mapByLevel[oncall.escalation_level]) {
        mapByLevel[oncall.escalation_level] = [];
      }
      mapByLevel[oncall.escalation_level].push(oncall);
    });
    return Object.keys(mapByLevel)
      .sort()
      .map((level) => {
        return (
          <Box
            m={1}
            p={1}
            key={level}
            borderRadius="sm"
            borderWidth={1}
            bg="blackAlpha.200"
            borderColor="blackAlpha.400"
          >
            <Text mx={1} my={0} fontSize="xs" fontWeight="bold">
              Level {level}
            </Text>
            <Flex>
              {mapByLevel[level].map((oncall: any) => (
                <Badge
                  display="inline-block"
                  mx={1}
                  mb={1}
                  key={oncall.user.id}
                  p={1}
                  colorScheme="gray"
                  variant="solid"
                  cursor="pointer"
                  onClick={() => {
                    window.open(oncall.user.html_url, "_blank");
                  }}
                >
                  {oncall.user.summary}
                </Badge>
              ))}
            </Flex>
          </Box>
        );
      });
  }, [oncalls]);

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
        // accessor: "summary",
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
        <a href={service?.html_url} target="_blank">
          {service?.name}
        </a>
      </Title>
      {onCallBadges.length > 0 && (
        <Box mt={2} mb={2}>
          <Text mb={0} fontSize="md" fontWeight="bold">
            On Call
          </Text>
          <Flex wrap="wrap">{onCallBadges}</Flex>
        </Box>
      )}
      {hasIncidents ? (
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
