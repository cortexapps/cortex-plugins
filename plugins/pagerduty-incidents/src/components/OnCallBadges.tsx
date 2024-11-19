import type React from "react";
import { useMemo } from "react";
import { Box, Badge, Text, Flex } from "@chakra-ui/react";

interface OnCallBadgesProps {
  oncalls: any[];
}

const OnCallBadges: React.FC<OnCallBadgesProps> = ({ oncalls }) => {
  const badges = useMemo(() => {
    if (!oncalls || oncalls.length === 0) {
      return [];
    }

    const mapByLevel: Record<number, any[]> = {};
    oncalls.forEach((oncall) => {
      if (!mapByLevel[oncall.escalation_level]) {
        mapByLevel[oncall.escalation_level] = [];
      }
      mapByLevel[oncall.escalation_level].push(oncall);
    });

    return Object.keys(mapByLevel)
      .sort()
      .map((level) => (
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
            {mapByLevel[level].map((oncall) => (
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
      ));
  }, [oncalls]);

  if (badges.length === 0) {
    return null;
  }

  return (
    <Box mt={2} mb={2}>
      <Text mb={0} fontSize="md" fontWeight="bold">
        On Call
      </Text>
      <Flex wrap="wrap">{badges}</Flex>
    </Box>
  );
};

export default OnCallBadges;
