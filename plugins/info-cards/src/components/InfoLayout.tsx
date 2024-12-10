import type { InfoCardI, InfoRowI } from "../typings";
import { Box } from "@chakra-ui/react";
import InfoRow from "./InfoRow";

interface InfoLayoutProps {
  infoRows: InfoRowI[];
  infoCards: InfoCardI[];
}
export default function InfoLayout({
  infoRows,
  infoCards,
}: InfoLayoutProps): JSX.Element {
  return (
    <Box w={"full"} display={"flex"} flexDirection={"column"} gap={4}>
      {infoRows.map((row) => (
        <InfoRow key={row.id} infoCards={infoCards} infoRow={row} />
      ))}
    </Box>
  );
}
