import type { InfoRowI } from "../typings";
import { Box } from "@chakra-ui/react";
import InfoRow from "./InfoRow";

interface InfoLayoutProps {
  infoRows: InfoRowI[];
}
export default function InfoLayout({ infoRows }: InfoLayoutProps): JSX.Element {
  return (
    <Box w={"full"} display={"flex"} flexDirection={"column"} gap={4}>
      {infoRows.map((row) => (
        <InfoRow key={row.id} infoRow={row} />
      ))}
    </Box>
  );
}
