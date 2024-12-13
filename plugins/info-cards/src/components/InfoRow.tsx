import type { InfoRowI } from "../typings";
import { Box } from "@chakra-ui/react";
import InfoCard from "./InfoCard";

interface InfoRowProps {
  infoRow: InfoRowI;
}
export default function InfoRow({ infoRow }: InfoRowProps): JSX.Element {
  return (
    <Box display={"flex"} gap={4} width={"full"} justifyContent={"center"}>
      {infoRow.cards.map((card) => (
        <InfoCard key={card.id} card={card} />
      ))}
    </Box>
  );
}
