import type { InfoCardI, InfoRowI } from "../typings";
import { Box } from "@chakra-ui/react";
import InfoCard from "./InfoCard";

interface InfoRowProps {
  infoCards: InfoCardI[];
  infoRow: InfoRowI;
}
export default function InfoRow({
  infoCards,
  infoRow,
}: InfoRowProps): JSX.Element {
  return (
    <Box display={"flex"} gap={4} width={"full"} justifyContent={"center"}>
      {infoCards
        .filter((card) => card.rowId === infoRow.id)
        .map((card) => (
          <InfoCard key={card.id} card={card} />
        ))}
    </Box>
  );
}
