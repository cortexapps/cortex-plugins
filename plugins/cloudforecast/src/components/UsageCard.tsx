import type React from "react";

import { Box, Text } from "@chakra-ui/react";
import { formatNumberAsCurrency } from "../utils";

interface UsageCardProps {
  label: string;
  value: string | number;
  description: string;
}

// Usage Card Component
const UsageCard: React.FC<UsageCardProps> = ({ label, value, description }) => {
  return (
    <Box p={2} bg="gray.100" borderRadius="md" shadow="sm" textAlign="center">
      <Text m={0} fontSize="lg" fontWeight="bold">
        {typeof value === "number" ? formatNumberAsCurrency(value) : value}
      </Text>
      <Text m={0} fontSize="sm" mt={1}>
        {label}
      </Text>
      <Text m={0} color="green.600" fontWeight="bold">
        {description}
      </Text>
    </Box>
  );
};

export default UsageCard;
