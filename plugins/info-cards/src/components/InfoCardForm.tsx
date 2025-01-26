import { useEffect, useState } from "react";
import type { InfoCardI, InfoRowI } from "../typings";
import useDebounce from "../../../../shared/hooks/useDebounce";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";

import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import {
  PiCheck,
  PiSpinner,
  PiX,
  PiArrowsOut,
  PiArrowsIn,
} from "react-icons/pi";

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

  const [isCodeareaExpanded, setIsCodeareaExpanded] = useState<boolean>(false);

  const collapsedContainderStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
  };
  const expandedContainerStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    padding: "2rem",
    width: "100%",
    height: "100%",
    zIndex: 1,
  };

  const expandButtonStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: 1,
    top: 0,
    right: 0,
    fontSize: "1.5rem",
    background: "rgba(255,255,255,0.75)",
  };

  const collapseButtonStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: 1,
    top: "0.25rem",
    right: "0.25rem",
    fontSize: "1.5rem",
    backgroundColor: "white",
    borderRadius: "0.25rem",
  };

  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: -1,
  };

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
    <Box display={"flex"} flexDirection={"column"} gap={4} maxW={250}>
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
        <FormLabel>Content Type</FormLabel>
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
          {isCodeareaExpanded && (
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
              <span style={{ opacity: 0.5 }}>Editor is expanded</span>
            </Box>
          )}
          <Box
            style={
              isCodeareaExpanded
                ? { ...expandedContainerStyle }
                : { ...collapsedContainderStyle }
            }
          >
            {isCodeareaExpanded && (
              <Box
                style={overlayStyle}
                onClick={() => {
                  setIsCodeareaExpanded(false);
                }}
              ></Box>
            )}
            <button
              style={
                isCodeareaExpanded
                  ? { ...collapseButtonStyle }
                  : { ...expandButtonStyle }
              }
              onClick={() => {
                setIsCodeareaExpanded(!isCodeareaExpanded);
              }}
            >
              {isCodeareaExpanded ? <PiArrowsIn /> : <PiArrowsOut />}
            </button>

            <Box
              style={
                isCodeareaExpanded
                  ? {
                      backgroundColor: "white",
                      padding: "1rem",
                      borderRadius: "0.25rem",
                      border: "1px solid #ccc",
                      maxHeight: "100%",
                      overflowY: "auto",
                    }
                  : {}
              }
            >
              <CodeMirror
                value={infoCard.contentHTML ?? ""}
                onChange={(value) => {
                  handleChange("contentHTML", value);
                }}
                extensions={[html()]}
                style={
                  !isCodeareaExpanded
                    ? { maxHeight: 50, overflowY: "auto" }
                    : {}
                }
              />
              {isCodeareaExpanded && (
                <Box display={"flex"} justifyContent={"flex-end"} mt={4}>
                  <Button
                    color={"purple.500"}
                    onClick={() => {
                      setIsCodeareaExpanded(false);
                    }}
                    leftIcon={<PiArrowsIn />}
                  >
                    Close
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </FormControl>
      )}
    </Box>
  );
}
