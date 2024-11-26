import type React from "react";
import { Box, Text, HStack, Link, Icon } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  WiRainWind as StormyIcon,
  WiCloudy as CloudyIcon,
} from "react-icons/wi";
import { PiAlien } from "react-icons/pi";

import { type CloudForecastRecentAlert } from "../cloudForecastSchema";

// Custom AlertIcon Component
const AlertIcon: React.FC<{ status: string }> = ({ status }) => {
  if (status === "stormy") {
    return <Icon as={StormyIcon} fontSize="4em" color="red.800" />;
  } else if (status === "cloudy") {
    return <Icon as={CloudyIcon} fontSize="4em" color="orange.400" />;
  } else {
    return <Icon as={PiAlien} fontSize="4em" color="gray.500" />;
  }
};

// AlertCard Props Interface
interface AlertCardProps {
  alert: CloudForecastRecentAlert;
}

// AlertCard Component
const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const { description, status, whyDeepLink } = alert;

  return (
    <Box
      p={3}
      bg={status === "stormy" ? "red.100" : "orange.100"}
      borderRadius="lg"
      shadow="xs"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      maxW="100%"
    >
      {/* Left Section: Icon + Description */}
      <HStack spacing={3} align="center" flex="1">
        <AlertIcon status={status ?? "unknown"} />
        <Text
          fontSize="sm"
          fontWeight="semibold"
          noOfLines={1}
          my="auto"
          color={status === "stormy" ? "red.800" : "orange.700"}
        >
          {description ?? "No Title"}
        </Text>
      </HStack>

      {/* Right Section: Why? Link */}
      {whyDeepLink && (
        <Link
          // no hover effect
          _hover={{ textDecoration: "none" }}
          href={whyDeepLink}
          isExternal
          px={3}
          py={1}
          fontSize="xs"
          fontWeight="bold"
          borderRadius="full"
          display="flex"
          alignItems="center"
          gap={1}
          color="white"
          bg={status === "stormy" ? "red.800" : "orange.800"}
        >
          Why? <ExternalLinkIcon />
        </Link>
      )}
    </Box>
  );
};

export default AlertCard;
