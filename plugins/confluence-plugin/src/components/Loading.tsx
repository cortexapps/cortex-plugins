import { Box, Spinner, Text } from "@chakra-ui/react";

export default function Loading(): JSX.Element {
  return (
    <Box
      w={"full"}
      minH={400}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      gap={6}
    >
      <Spinner color="purple" size="xl" />
      <Text size="md">Loading...</Text>
    </Box>
  );
}
