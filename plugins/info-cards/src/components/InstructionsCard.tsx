import { Box, Button, Card, Heading, Text } from "@chakra-ui/react";
import { PiGear } from "react-icons/pi";

interface InstructionsCardProps {
  toggleEditor: () => void;
}

const InstructionsCard: React.FC<InstructionsCardProps> = ({
  toggleEditor,
}) => {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      marginTop={8}
      flexDirection={"column"}
      p={8}
    >
      <Card
        display={"inline-block"}
        w={"auto"}
        bg={"gray.100"}
        boxShadow={"md"}
        p={8}
        borderRadius={8}
      >
        <Heading size={"lg"} mb={6}>
          Info Cards Plugin
        </Heading>
        <Text mb={4}>
          This plugin makes it possible to view useful information in cards.
        </Text>
        <Text mb={4}>
          To get started, please configure the layout and cards in the editor.
        </Text>
        <Button
          leftIcon={<PiGear />}
          colorScheme="purple"
          onClick={toggleEditor}
          w={"auto"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          Go to Editor
        </Button>
      </Card>
    </Box>
  );
};

export default InstructionsCard;
