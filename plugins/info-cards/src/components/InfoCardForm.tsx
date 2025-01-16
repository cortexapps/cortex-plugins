import { useEffect, useState } from "react";
import type { InfoCardI, InfoRowI } from "../typings";
import useDebounce from "../../../../shared/hooks/useDebounce";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { PiCheck, PiSpinner, PiX } from "react-icons/pi";

interface ContentTypesSelectItemI {
  label: string;
  value: string;
}

interface InfoCardFormProps {
  infoCard: InfoCardI;
  setInfoRows?: React.Dispatch<React.SetStateAction<InfoRowI[]>>;
}

export default function InfoCardForm({
  infoCard,
  setInfoRows,
}: InfoCardFormProps): JSX.Element {
  const contentTypes: ContentTypesSelectItemI[] = [
    { label: "IFrame URL", value: "IFrameURL" },
    { label: "HTML", value: "HTML" },
  ];

  const [contentIFrameURL, setContentIFrameURL] = useState<string>("");
  const debouncedContentIFrameURL = useDebounce(
    contentIFrameURL,
    1000
  ) as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [isUrlIFrameSafe, setIsUrlIFrameSafe] = useState<boolean | null>(null);

  useEffect(() => {
    setIsUrlIFrameSafe(null);
    setIsError(null);
    if (contentIFrameURL.length > 0) {
      async function checkUrlHeaders(): Promise<void> {
        setIsLoading(true);
        try {
          const response = await fetch(debouncedContentIFrameURL);
          const headers = Object.fromEntries(response.headers);

          if (
            headers["x-frame-options"] ||
            headers["content-security-policy"]
          ) {
            setIsUrlIFrameSafe(false);
          } else {
            setIsUrlIFrameSafe(true);
          }
        } catch (error) {
          setIsError("URL check failed!");
        }
        setIsLoading(false);
      }

      void checkUrlHeaders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContentIFrameURL]);

  const handleChange = (field: keyof InfoCardI, value: string): void => {
    if (!setInfoRows) return;
    setInfoRows((infoRows) => {
      return infoRows.map((ir) => {
        return {
          ...ir,
          cards: ir.cards.map((ic) => {
            if (infoCard.id === ic.id) {
              return {
                ...ic,
                [field]: value,
              };
            }
            return ic;
          }),
        };
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
          <Box display={"flex"}>
            <FormLabel>Content URL</FormLabel>
            {isLoading && (
              <Text>
                <PiSpinner size={24} />
              </Text>
            )}
            {isUrlIFrameSafe && (
              <Text color={"green.500"}>
                <PiCheck size={24} />
              </Text>
            )}
            {isUrlIFrameSafe === false ||
              (isError && (
                <Text color={"red.500"}>
                  <PiX size={24} />
                </Text>
              ))}
          </Box>
          <Input
            type="url"
            placeholder="https://example.com"
            value={infoCard.contentIFrameURL ?? ""}
            onChange={(e) => {
              setContentIFrameURL(e.target.value);
              handleChange("contentIFrameURL", e.target.value);
            }}
          />

          {isUrlIFrameSafe === false && (
            <Text color={"red.500"} fontSize={"sm"}>
              This URL does not allow embedding
            </Text>
          )}
          {isError && <Text color={"red.500"}>{isError}</Text>}
        </FormControl>
      )}

      {infoCard.contentType === "HTML" && (
        <FormControl>
          <FormLabel>Content as HTML</FormLabel>
          <CodeEditor
            language="html"
            placeholder="Type HTML here..."
            value={infoCard.contentHTML ?? ""}
            onChange={(e) => {
              handleChange("contentHTML", e.target.value);
            }}
            style={{
              width: "100%",
              height: "auto",
              fontSize: "1rem",
              borderRadius: "0.375rem",
              minWidth: 0,
              outline: "transparent solid 2px",
              outlineOffset: "2px",
              borderWidth: "1px",
              borderStyle: "solid",
              borderImage: "initial",
              borderColor: "inherit",
              background: "inherit",
              resize: "both",
              fontFamily:
                "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            }}
          />
        </FormControl>
      )}
    </Box>
  );
}
