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

import { PiPlus, PiFloppyDisk, PiEye, PiArrowLeft } from "react-icons/pi";
import { Box, Button, Heading, Text, useDisclosure } from "@chakra-ui/react";
import PreviewModal from "./PreviewModal";

interface LayoutBuilderProps {
  toggleEditor: () => void;
  infoRows: InfoRowI[];
  setInfoRows: React.Dispatch<React.SetStateAction<InfoRowI[]>>;
  infoCards: InfoCardI[];
  setInfoCards: React.Dispatch<React.SetStateAction<InfoCardI[]>>;
}

const LayoutBuilder = ({
  toggleEditor,
  infoRows,
  setInfoRows,
  infoCards,
  setInfoCards,
}: LayoutBuilderProps): JSX.Element => {
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

  const saveLayout = (): void => {
    const layout = JSON.stringify(infoRows, null, 2);
    console.warn(layout);
    // const blob = new Blob([layout], { type: "application/json" });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "layout.json";
    // a.click();
    // URL.revokeObjectURL(url);
  };

  function addInfoRow(): void {
    const infoRowToAdd = {
      id: new Date().getTime(),
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

    const isActiveAInfoRow = active.data.current?.type === "InfoRow";
    if (!isActiveAInfoRow) return;

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

    const isActiveAInfoCard = active.data.current?.type === "InfoCard";
    const isOverAInfoCard = over.data.current?.type === "InfoCard";

    if (!isActiveAInfoCard) return;

    if (isActiveAInfoCard && isOverAInfoCard) {
      if (
        infoCards.filter(
          (card) => card.rowId === over.data.current?.infoCard.rowId
        ).length >= maxCardsPerRow
      ) {
        return;
      }
      setInfoCards((cards) => {
        const activeIndex = cards.findIndex((t) => t.id === activeId);
        const overIndex = cards.findIndex((t) => t.id === overId);

        if (cards[activeIndex].rowId !== cards[overIndex].rowId) {
          cards[activeIndex].rowId = cards[overIndex].rowId;
          return arrayMove(cards, activeIndex, overIndex - 1);
        }

        return arrayMove(cards, activeIndex, overIndex);
      });
    }

    const isOverAInfoRow = over.data.current?.type === "InfoRow";

    if (isActiveAInfoCard && isOverAInfoRow) {
      if (
        active.data.current?.infoCard.rowId !== overId &&
        infoCards.filter((card) => card.rowId === overId).length >=
          maxCardsPerRow
      ) {
        return;
      }

      setInfoCards((cards) => {
        const activeIndex = cards.findIndex((t) => t.id === activeId);
        cards[activeIndex].rowId = overId as number;
        return arrayMove(cards, activeIndex, activeIndex);
      });
    }
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
        <SortableContext
          items={infoRowsId}
          // strategy={verticalListSortingStrategy}
        >
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
              infoCards={infoCards}
              setInfoCards={setInfoCards}
              maxCardsPerRow={maxCardsPerRow}
            />
          ))}
          <Button
            onClick={addInfoRow}
            disabled={infoRows.length >= maxRows}
            colorScheme={"purple"}
            style={{ width: "100%" }}
            marginTop={4}
            leftIcon={<PiPlus />}
          >
            Add Row
          </Button>
        </SortableContext>
      </DndContext>

      <Box
        display={"flex"}
        gap={4}
        width={"full"}
        justifyContent={"end"}
        marginTop={12}
      >
        <Button
          onClick={toggleEditor}
          variant={"outline"}
          colorScheme={"red"}
          leftIcon={<PiArrowLeft />}
        >
          Back
        </Button>
        <Button
          onClick={onPreviewOpen}
          variant={"solid"}
          colorScheme={"blue"}
          leftIcon={<PiEye />}
        >
          Show Preview
        </Button>
        <Button
          onClick={saveLayout}
          disabled={infoRows.length === 0 || infoCards.length === 0}
          variant={"solid"}
          colorScheme={"green"}
          leftIcon={<PiFloppyDisk />}
        >
          Save Layout
        </Button>
      </Box>
      <PreviewModal
        infoRows={infoRows}
        infoCards={infoCards}
        isOpen={isPreviewOpen}
        onClose={onPreviewClose}
        handleAction={saveLayout}
      />
    </Box>
  );
};

export default LayoutBuilder;
