import { Box, FormLabel, Select } from "@chakra-ui/react";

export default function PageSelector({
  currentPageId,
  onChangeHandler,
  pages,
  disabled,
}: {
  currentPageId: string | number;
  onChangeHandler: CallableFunction;
  pages: EntityPageI[];
  disabled: boolean;
}): JSX.Element {
  return (
    <Box
      mb={"1rem"}
      display={"flex"}
      justifyContent={"flex-end"}
      alignItems={"baseline"}
      w={"full"}
    >
      <FormLabel>Select confluence page:</FormLabel>
      <Select
        value={currentPageId}
        onChange={(e) => {
          void onChangeHandler(e.target.value);
        }}
        disabled={disabled}
        w={"auto"}
      >
        {pages.map((page) => (
          <option key={page.id} value={page.id}>
            {page.title && page.title.length > 0
              ? page.title
              : `Confluence Page ${page.id}`}
          </option>
        ))}
      </Select>
    </Box>
  );
}
