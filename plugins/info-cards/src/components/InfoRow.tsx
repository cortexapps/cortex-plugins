import type { InfoRowI } from "../typings";
import { Box, theme } from "@chakra-ui/react";
import InfoCard from "./InfoCard";

interface InfoRowProps {
  infoRow: InfoRowI;
}
export default function InfoRow({ infoRow }: InfoRowProps): JSX.Element {
  return (
    <Box
      display={"flex"}
      gap={4}
      width={"full"}
      justifyContent={"center"}
      style={
        infoRow.cards.length < 1
          ? { height: "1px", backgroundColor: theme.colors.gray[100] }
          : {}
      }
    >
      {infoRow.cards.map((card) => (
        <InfoCard key={card.id} card={card} />
      ))}
    </Box>
  );
}
