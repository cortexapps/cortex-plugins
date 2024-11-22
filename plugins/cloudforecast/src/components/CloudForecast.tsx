import type React from "react";
import { Box, Text, Grid, VStack, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { Loader } from "@cortexapps/plugin-core/components";

import { formatNumberAsCurrency } from "../utils";
import { useEntityCloudForecastData } from "../hooks";

import ErrorComponent from "./ErrorComponent";
import AlertCard from "./AlertCard";
import UsageCard from "./UsageCard";
import MonthlyCard from "./MonthlyCard";

// Main Forecast Component
const CloudForecast: React.FC = () => {
  const {
    isLoading,
    error,
    cloudForecastData: data,
  } = useEntityCloudForecastData();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorComponent title="Error fetching data" error={error} />;
  }

  if (!data) {
    return (
      <ErrorComponent
        title="No data found"
        error="No data found for this entity."
      />
    );
  }

  const { links, entityTag, dailyMetrics, monthlyMetrics, recentAlerts } = data;

  return (
    <Box p={5} bg="gray.50" borderRadius="lg" boxShadow="md" mx="auto">
      {/* Header */}
      <VStack align="start" spacing={1}>
        <Link
          href={links.mostRecentReportDeepLink}
          fontSize="lg"
          fontWeight="bold"
          isExternal
        >
          {entityTag} - CloudForecast <ExternalLinkIcon mx="2px" />
        </Link>
        <Text fontSize="xl" fontWeight="bold" color="gray.700">
          ⚡ {formatNumberAsCurrency(dailyMetrics.mostRecentDay.cost)} Daily
          Spend
        </Text>
      </VStack>

      {/* Forecast Alerts */}
      {recentAlerts && recentAlerts?.length > 0 && (
        <Box mt={5}>
          <Text m="auto" fontSize="md" fontWeight="semibold" mb={3}>
            Forecast Alerts
          </Text>
          <Grid templateColumns="repeat(1, 1fr)" gap={4}>
            {recentAlerts.map((alert, index) => (
              <AlertCard key={index} alert={alert} />
            ))}
          </Grid>
        </Box>
      )}

      {/* Daily Usage */}
      <Box mt={8}>
        <Text fontSize="md" fontWeight="semibold" mb={3}>
          Daily Usage
        </Text>
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          {dailyMetrics?.previousDay && (
            <UsageCard
              label={dailyMetrics.previousDay.dayAsStr}
              value={dailyMetrics.previousDay.cost}
              description="Previous Day"
            />
          )}
          <UsageCard
            label={dailyMetrics.mostRecentDay.dayAsStr}
            value={dailyMetrics.mostRecentDay.cost}
            description="Most Recent Day"
          />
          <UsageCard
            label="7-Day Avg."
            value={dailyMetrics.sevenDayAverage ?? "N/A"}
            description="7-Day"
          />
          <UsageCard
            label="30-Day Avg."
            value={dailyMetrics.thirtyDayAverage ?? "N/A"}
            description="30-Day"
          />
        </Grid>
      </Box>

      {/* Monthly Data */}
      <Box mt={8}>
        <Text fontSize="md" fontWeight="semibold" mb={3}>
          Monthly Data
        </Text>
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <MonthlyCard
            label="Current Month"
            data={monthlyMetrics.currentMonth}
            additionalDetails={[
              `Month: ${monthlyMetrics.currentMonth.monthAsStr}`,
              `Budget: ${formatNumberAsCurrency(
                monthlyMetrics.monthlyBudget ?? 0
              )}`,
            ]}
          />
          {monthlyMetrics?.previousMonth && (
            <MonthlyCard
              label="Previous Month"
              data={monthlyMetrics.previousMonth}
              additionalDetails={[
                `Month: ${monthlyMetrics.previousMonth.monthAsStr}`,
                `Forecast: ${formatNumberAsCurrency(
                  monthlyMetrics.endOfMonthForecast || 0
                )}`,
              ]}
            />
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default CloudForecast;
