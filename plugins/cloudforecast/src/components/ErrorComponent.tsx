import type React from "react";

import { Box, Text } from "@chakra-ui/react";

interface ErrorComponentProps {
  title: string;
  error: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  title = "Error",
  error,
}) => {
  return (
    <Box
      p={5}
      bg="gray.50"
      borderRadius="lg"
      boxShadow="md"
      maxW="800px"
      mx="auto"
    >
      <Text fontSize="xl" fontWeight="bold" color="gray.700">
        {title}
      </Text>
      <Text fontSize="md" color="gray.600">
        {error}
      </Text>
    </Box>
  );
};

export default ErrorComponent;
