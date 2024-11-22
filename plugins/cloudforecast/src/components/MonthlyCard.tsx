import type React from "react";
import { Box, Text, VStack, Divider } from "@chakra-ui/react";
import { type CloudForecastMonthMetrics } from "../cloudForecastSchema";
import { formatNumberAsCurrency } from "../utils";

interface MonthlyCardProps {
  label: string;
  data: CloudForecastMonthMetrics;
  additionalDetails: string[];
}

// Monthly Card Component
const MonthlyCard: React.FC<MonthlyCardProps> = ({
  label,
  data,
  additionalDetails,
}) => {
  return (
    <Box p={2} bg="gray.100" borderRadius="md" shadow="sm">
      <Text m={0} fontSize="md" fontWeight="bold">
        {label}
      </Text>
      <Text m={0} fontSize="lg" fontWeight="bold">
        {formatNumberAsCurrency(data.cost)}
      </Text>
      <Divider />
      <VStack align="start" spacing={1}>
        {additionalDetails.map((detail, index) => (
          <Text m={0} key={index} fontSize="sm" color="gray.600">
            {detail}
          </Text>
        ))}
      </VStack>
    </Box>
  );
};

export default MonthlyCard;
