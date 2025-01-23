import type React from "react";
import { useMemo } from "react";
import InfoRowEditor from "./InfoRowEditor";
import type { InfoCardI, InfoRowI } from "../typings";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

import { PiPlus } from "react-icons/pi";
import { Box, Button, Heading, Text, useDisclosure } from "@chakra-ui/react";

import PreviewModal from "./PreviewModal";
import CancelEditModal from "./CancelEditModal";

interface LayoutBuilderProps {
  toggleEditor: () => void;
  infoRows: InfoRowI[];
  setInfoRows: React.Dispatch<React.SetStateAction<InfoRowI[]>>;
  isModified: boolean;
  onSubmit: () => void;
}

const moveCard = (data: InfoRowI[], activeId, overId): InfoRowI[] => {
  let activeCard: InfoCardI | null = null;
  let activeRowIndex = -1;
  let activeCardIndex = -1;
  let overRowIndex = -1;
  let overCardIndex = -1;

  // Find the active card and its source row
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const cardIndex = row.cards.findIndex((card) => card.id === activeId);
    if (cardIndex !== -1) {
      activeRowIndex = i;
      activeCardIndex = cardIndex;
      activeCard = row.cards[cardIndex];
      break;
    }
  }

  if (!activeCard) {
    throw new Error("Active card not found");
  }

  // Remove the active card from its current position
  data[activeRowIndex].cards.splice(activeCardIndex, 1);

  // Find the over card and its target row
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const cardIndex = row.cards.findIndex((card) => card.id === overId);
    if (cardIndex !== -1) {
      overRowIndex = i;
      overCardIndex = cardIndex;
      break;
    }
  }

  if (overRowIndex === -1 || overCardIndex === -1) {
    // overId is not a card, so it must be a row
    // Find the row with the overId
    const overRow = data.find((row) => row.id === overId);
    if (overRow) {
      overRowIndex = data.indexOf(overRow);
      overCardIndex = 0; // Insert at the beginning of the row
    } else {
      // error, so put the card back in its original position
      data[activeRowIndex].cards.splice(activeCardIndex, 0, activeCard);
      throw new Error("Over row not found");
    }
  }

  // Insert the active card into the target row before the over card
  data[overRowIndex].cards.splice(overCardIndex, 0, activeCard);

  // Update the active card's rowId if it has moved to a new row
  activeCard.rowId = data[overRowIndex].id;

  return data;
};

const LayoutBuilder: React.FC<LayoutBuilderProps> = ({
  toggleEditor,
  infoRows,
  setInfoRows,
  isModified,
  onSubmit,
}) => {
  const {
    isOpen: isPreviewOpen,
    onOpen: onPreviewOpen,
    onClose: onPreviewClose,
  } = useDisclosure();

  const infoRowsId = useMemo(
    () => infoRows.map((infoRow) => infoRow.id),
    [infoRows]
  );

  const maxRows = 10;
  const maxCardsPerRow = 4;

  // sensor for pointer events
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  function addInfoRow(): void {
    const infoRowToAdd = {
      id: new Date().getTime(),
      cards: [],
    };
    setInfoRows([...infoRows, infoRowToAdd]);
  }

  // function to handle drag end event
  function onDragEnd(DragEndEvent: DragEndEvent): void {
    const { active, over } = DragEndEvent;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAnInfoRow = active.data.current?.type === "InfoRow";
    if (!isActiveAnInfoRow) return;

    setInfoRows((infoRows) => {
      const activeInfoRowIndex = infoRows.findIndex(
        (infoRow) => infoRow.id === activeId
      );

      const overInfoRowIndex = infoRows.findIndex(
        (infoRow) => infoRow.id === overId
      );

      return arrayMove(infoRows, activeInfoRowIndex, overInfoRowIndex);
    });
  }

  // function to handle drag over event
  function onDragOver(DragOverEvent: DragOverEvent): void {
    const { active, over } = DragOverEvent;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAnInfoCard = active.data.current?.type === "InfoCard";

    if (!isActiveAnInfoCard) return;

    setInfoRows((infoRows) =>
      moveCard(infoRows, activeId as string, overId as string)
    );
  }

  return (
    <Box w={"full"} p={4} minH={"100vh"}>
      <Heading size={"lg"} mb={4}>
        Configure Layout and Cards
      </Heading>
      <DndContext
        sensors={sensors}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <SortableContext items={infoRowsId}>
          {infoRows.length === 0 && (
            <Box
              h={50}
              w={"full"}
              border={1}
              backgroundColor={"gray.100"}
              rounded={4}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              boxShadow={"md"}
            >
              <Text color={"black"}>Empty</Text>
            </Box>
          )}
          {infoRows.map((row) => (
            <InfoRowEditor
              key={row.id}
              infoRow={row}
              infoRows={infoRows}
              setInfoRows={setInfoRows}
              maxCardsPerRow={maxCardsPerRow}
            />
          ))}
          <Button
            onClick={addInfoRow}
            disabled={infoRows.length >= maxRows}
            colorScheme={"purple"}
            style={{ width: "100%" }}
            mt={2}
            leftIcon={<PiPlus />}
          >
            Add Row
          </Button>
        </SortableContext>
      </DndContext>

      <Box
        display={"flex"}
        gap={2}
        width={"full"}
        justifyContent={"end"}
        mt={4}
      >
        <CancelEditModal isModified={isModified} toggleEditor={toggleEditor} />
        <Button onClick={onPreviewOpen} variant={"solid"} colorScheme={"blue"}>
          Preview
        </Button>
        <Button
          onClick={onSubmit}
          disabled={infoRows.length === 0}
          variant={"solid"}
          colorScheme={"green"}
        >
          Save
        </Button>
      </Box>
      <PreviewModal
        infoRows={infoRows}
        isOpen={isPreviewOpen}
        onClose={onPreviewClose}
        handleAction={onSubmit}
      />
    </Box>
  );
};

export default LayoutBuilder;
