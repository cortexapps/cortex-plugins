// import { useMemo } from "react";
import type { InfoRowI } from "../typings";
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
  maxCardsPerRow: number;
}

const InfoRowComponent: React.FC<InfoRowComponentProps> = ({
  infoRow,
  infoRows,
  setInfoRows,
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
    if (!setInfoRows) return;
    setInfoRows(infoRows?.filter((row) => row.id !== infoRowId) ?? []);
  };

  const addInfoCard = (infoRowId: number): void => {
    if (!setInfoRows) return;
    const infoCardToAdd = {
      id: new Date().getTime(),
      rowId: infoRowId,
      title: "",
      contentType: "",
    };
    setInfoRows(
      infoRows?.map((row) => {
        if (row.id === infoRowId) {
          return {
            ...row,
            cards: [...row.cards, infoCardToAdd],
          };
        }
        return row;
      }) ?? []
    );
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
          Cards {infoRow.cards.length}/{maxCardsPerRow}
        </Text>
        <Button onClick={onOpen} variant={"plain"} size={"sm"} color={"red"}>
          <PiTrash />
        </Button>{" "}
      </Box>

      <Box w={"full"} overflowX={"auto"} maxW={"full"}>
        <Box display={"flex"} flexDirection={"row"} gap={4} w={"full"}>
          <SortableContext items={infoRow.cards.map((card) => card.id)}>
            {infoRow.cards.map((card) => (
              <InfoCardEditor
                key={card.id}
                infoCard={card}
                setInfoRows={setInfoRows}
              />
            ))}
          </SortableContext>
          {infoRow.cards.length < maxCardsPerRow && (
            <Button
              onClick={() => {
                addInfoCard(infoRow.id);
              }}
              disabled={infoRow.cards.length >= maxCardsPerRow}
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
