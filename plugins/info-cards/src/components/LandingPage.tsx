import { Box, Button } from "@chakra-ui/react";
import InfoLayout from "./InfoLayout";
import { PiGear } from "react-icons/pi";
import type { InfoRowI } from "../typings";
import InstructionsCard from "./InstructionsCard";

interface LandingPageProps {
  toggleEditor: () => void;

  // TODO: infoCards and infoRows will be fetched from the API
  // infoCards: InfoCardI[];
  infoRows: InfoRowI[];
}
export default function LandingPage({
  toggleEditor,
  // infoCards,
  infoRows,
}: LandingPageProps): JSX.Element {
  return (
    <Box w={"full"} minH={"100vh"} p={4}>
      <Box
        w={"full"}
        display={"flex"}
        justifyContent={"flex-end"}
        px={8}
        py={2}
      >
        <Button
          colorScheme={"black"}
          leftIcon={<PiGear />}
          variant={"link"}
          onClick={toggleEditor}
        >
          Edit Layout
        </Button>
      </Box>
      {infoRows.length === 0 ? (
        <InstructionsCard toggleEditor={toggleEditor} />
      ) : (
        <InfoLayout infoRows={infoRows} />
      )}
    </Box>
  );
}
