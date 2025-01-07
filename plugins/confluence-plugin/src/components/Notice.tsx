import { Box, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

export default function Notice({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <Box bg="gray.200" p={3} borderRadius={4}>
      <Text m={0}>{children}</Text>
    </Box>
  );
}
