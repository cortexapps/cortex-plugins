import { useMemo } from "react";
import type { InfoRowI, InfoCardI } from "../typings";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import { PiDotsSix, PiTrash, PiPlus } from "react-icons/pi";
import InfoCardEditor from "./InfoCardEditor";
import ConfirmationModal from "./ConfirmationModal";

interface InfoRowComponentProps {
  infoRow: InfoRowI;
  infoRows?: InfoRowI[];
  setInfoRows?: React.Dispatch<React.SetStateAction<InfoRowI[]>>;
  infoCards: InfoCardI[];
  setInfoCards?: React.Dispatch<React.SetStateAction<InfoCardI[]>>;
  maxCardsPerRow: number;
}

const InfoRowComponent: React.FC<InfoRowComponentProps> = ({
  infoRow,
  infoRows,
  infoCards,
  setInfoRows,
  setInfoCards,
  maxCardsPerRow,
}) => {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: infoRow.id,
      data: {
        type: "InfoRow",
        infoRow,
      },
    });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteInfoRow = (infoRowId: number): void => {
    if (!setInfoRows || !setInfoCards) return;
    setInfoRows(infoRows?.filter((row) => row.id !== infoRowId) ?? []);
    setInfoCards(infoCards?.filter((card) => card.rowId !== infoRowId) ?? []);
  };

  // Got the tasks for the current column
  const infoCardIds = useMemo(() => {
    return infoCards.map((card) => card.id);
  }, [infoCards]);

  // Calculated the number of tasks in the column
  const infoCardCount = useMemo((): number => {
    return infoCards.filter((card) => card.rowId === infoRow.id).length;
  }, [infoCards, infoRow.id]);

  const addInfoCard = (infoRowId: number): void => {
    if (!setInfoCards) return;
    const infoCardToAdd = {
      id: new Date().getTime(),
      rowId: infoRowId,
      title: "",
      contentType: "",
    };
    setInfoCards([...infoCards, infoCardToAdd]);
  };

  return (
    <Box
      border={1}
      marginBottom={4}
      p={4}
      pt={10}
      position={"relative"}
      backgroundColor={"gray.200"}
      rounded={4}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      ref={setNodeRef}
    >
      <Button
        {...listeners}
        {...attributes}
        position={"absolute"}
        left={"50%"}
        top={0}
        style={{ transform: "translateX(-50%)" }}
        cursor={"grab"}
        size={"xs"}
        variant={"plain"}
      >
        <PiDotsSix />
      </Button>
      <Box
        position={"absolute"}
        right={0}
        top={0}
        display={"flex"}
        gap={4}
        alignItems={"center"}
      >
        <Text fontSize={"sm"} mt={1}>
          Cards {infoCards.filter((card) => card.rowId === infoRow.id).length}/
          {maxCardsPerRow}
        </Text>
        <Button onClick={onOpen} variant={"plain"} size={"sm"} color={"red"}>
          <PiTrash />
        </Button>{" "}
      </Box>

      <Box w={"full"} overflowX={"auto"} maxW={"full"}>
        <Box display={"flex"} flexDirection={"row"} gap={4} w={"full"}>
          <SortableContext items={infoCardIds}>
            {infoCards
              .filter((card) => card.rowId === infoRow.id)
              .map((card) => (
                <InfoCardEditor
                  key={card.id}
                  infoCard={card}
                  setInfoCards={setInfoCards}
                />
              ))}
          </SortableContext>
          {infoCardCount < maxCardsPerRow && (
            <Button
              onClick={() => {
                addInfoCard(infoRow.id);
              }}
              disabled={infoCardCount >= maxCardsPerRow}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              w={100}
              h={100}
              border={1}
              borderStyle={"dashed"}
              borderColor={"gray"}
              rounded={4}
              alignSelf={"center"}
              color={"black"}
              backgroundColor={"white"}
              _hover={{ bg: "purple.100" }}
            >
              <PiPlus />
              <Box mt={2}>
                Add
                <br />
                Card
              </Box>
            </Button>
          )}
        </Box>
      </Box>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        handleAction={() => {
          deleteInfoRow(infoRow.id);
        }}
        actionButtonColorScheme="red"
        actionButtonText="Delete"
      >
        <Text>
          Are you sure you want to delete entire row? All the cards inside the
          row will be deleted!
        </Text>
      </ConfirmationModal>
    </Box>
  );
};

export default InfoRowComponent;
