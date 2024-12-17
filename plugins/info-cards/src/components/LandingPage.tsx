import { Box, IconButton } from "@chakra-ui/react";
import InfoLayout from "./InfoLayout";
import { PiPencil } from "react-icons/pi";
import type { InfoRowI } from "../typings";
import InstructionsCard from "./InstructionsCard";

interface LandingPageProps {
  toggleEditor: () => void;
  infoRows: InfoRowI[];
}

const LandingPage: React.FC<LandingPageProps> = ({
  toggleEditor,
  infoRows,
}) => {
  return (
    <Box w={"full"} minH={"100vh"} p={4} position="relative">
      <Box
        position="absolute"
        top={2}
        right={2}
        zIndex={10}
        w={"full"}
        display={"flex"}
        justifyContent={"flex-end"}
        role="group"
        pointerEvents={"none"}
      >
        <IconButton
          size={"xs"}
          m={0}
          p={0}
          aria-label={"Edit Layout"}
          shadow={"md"}
          rounded={"full"}
          colorScheme={"purple"}
          onClick={toggleEditor}
          pointerEvents={"auto"}
          opacity={0.3}
          _groupHover={{ opacity: 1 }}
          transition="opacity 0.2s ease-in-out"
        >
          <PiPencil />
        </IconButton>
      </Box>
      {infoRows.length === 0 ? (
        <InstructionsCard toggleEditor={toggleEditor} />
      ) : (
        <InfoLayout infoRows={infoRows} />
      )}
    </Box>
  );
};

export default LandingPage;
