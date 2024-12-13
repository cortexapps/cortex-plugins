import type { InfoCardI, InfoRowI } from "../typings";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PiDotsSixVertical, PiTrash } from "react-icons/pi";
import { Box, Button, useDisclosure, Text } from "@chakra-ui/react";
import ConfirmationModal from "./ConfirmationModal";
import InfoCardForm from "./InfoCardForm";

interface InfoCardEditorProps {
  infoCard: InfoCardI;
  setInfoRows?: React.Dispatch<React.SetStateAction<InfoRowI[]>>;
}

const InfoCardEditor: React.FC<InfoCardEditorProps> = ({
  infoCard,
  setInfoRows,
}) => {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: infoCard.id,
      data: {
        type: "InfoCard",
        infoCard,
      },
    });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteInfoCard = (infoCardId: number): void => {
    if (!setInfoRows) return;
    setInfoRows((infoRows) =>
      infoRows.map((row) => ({
        ...row,
        cards: row.cards.filter((card) => card.id !== infoCardId),
      }))
    );
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      p={0}
      border={1}
      borderColor={"gray.500"}
      backgroundColor={"gray.50"}
      borderRadius={4}
      borderStyle={"solid"}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      ref={setNodeRef}
    >
      <Button
        {...listeners}
        {...attributes}
        alignSelf={"center"}
        size={"xs"}
        variant={"plain"}
        cursor={"grab"}
      >
        <PiDotsSixVertical />
      </Button>
      <Box position={"relative"} pl={0} pt={6} pr={6} pb={6}>
        <Button
          onClick={onOpen}
          position={"absolute"}
          right={0}
          top={0}
          variant={"plain"}
          color={"red"}
          size={"sm"}
        >
          <PiTrash />
        </Button>

        <InfoCardForm infoCard={infoCard} setInfoRows={setInfoRows} />
      </Box>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        handleAction={() => {
          deleteInfoCard(infoCard.id);
        }}
        actionButtonColorScheme="red"
        actionButtonText="Delete"
      >
        <Text>Are you sure you want to delete this card?</Text>
      </ConfirmationModal>
    </Box>
  );
};

export default InfoCardEditor;
