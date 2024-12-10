import type { InfoCardI } from "../typings";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";

interface ContentTypesSelectItemI {
  label: string;
  value: string;
}

interface InfoCardFormProps {
  infoCard: InfoCardI;
  setInfoCards?: React.Dispatch<React.SetStateAction<InfoCardI[]>>;
}

export default function InfoCardForm({
  infoCard,
  setInfoCards,
}: InfoCardFormProps): JSX.Element {
  const contentTypes: ContentTypesSelectItemI[] = [
    { label: "IFrame URL", value: "IFrameURL" },
    { label: "HTML", value: "HTML" },
  ];

  const handleChange = (field: keyof InfoCardI, value: string): void => {
    if (!setInfoCards) return;
    setInfoCards((infoCards) => {
      return infoCards.map((ic) => {
        if (infoCard.id === ic.id) {
          return {
            ...ic,
            [field]: value,
          };
        }
        return ic;
      });
    });
  };

  return (
    <Box display={"flex"} flexDirection={"column"} gap={4}>
      <FormControl>
        <FormLabel>Card Title</FormLabel>
        <Input
          type="text"
          value={infoCard.title}
          onChange={(e) => {
            handleChange("title", e.target.value);
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Card Title</FormLabel>
        <Select
          placeholder="Select content type"
          value={[infoCard.contentType]}
          onChange={(e: any) => {
            handleChange("contentType", e.target.value);
          }}
        >
          {contentTypes.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </FormControl>

      {infoCard.contentType.length === 0 && (
        <FormControl>
          <FormLabel color={"gray.400"}>Content</FormLabel>
          <Box
            w={"full"}
            h={10}
            border={1}
            rounded={4}
            borderColor={"gray.200"}
            borderStyle={"solid"}
            p={2}
            fontSize={"sm"}
          >
            <span style={{ opacity: 0.5 }}>Select content type first</span>
          </Box>
        </FormControl>
      )}

      {infoCard.contentType === "IFrameURL" && (
        <FormControl>
          <FormLabel>Content URL</FormLabel>
          <Input
            type="url"
            placeholder="https://example.com"
            value={infoCard.contentIFrameURL ?? ""}
            onChange={(e) => {
              handleChange("contentIFrameURL", e.target.value);
            }}
          />
        </FormControl>
      )}

      {infoCard.contentType === "HTML" && (
        <FormControl>
          <FormLabel>Content as HTML</FormLabel>
          <Textarea
            placeholder="Type HTML here..."
            value={infoCard.contentHTML ?? ""}
            onChange={(e) => {
              handleChange("contentHTML", e.target.value);
            }}
          />
        </FormControl>
      )}
    </Box>
  );
}
