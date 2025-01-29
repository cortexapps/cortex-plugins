import type { InfoCardI } from "../typings";
import { Box, Card, Heading } from "@chakra-ui/react";
import DOMPurify from "dompurify";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

interface InfoCardProps {
  card: InfoCardI;
}

export default function InfoCard({ card }: InfoCardProps): JSX.Element {
  let sanitizedContent = "";
  if (card.contentType === "HTML" && card.contentHTML) {
    sanitizedContent = DOMPurify.sanitize(card.contentHTML);
  }

  return (
    <Card
      width={"full"}
      bg={"gray.100"}
      p={4}
      borderRadius={8}
      boxShadow={"md"}
      display={"flex"}
      flexDirection={"column"}
    >
      {card.title && card.title.length > 0 && (
        <Heading size={"lg"} mb={4}>
          {card.title}
        </Heading>
      )}
      <Box display={"flex"} flex={1} w={"full"}>
        {card.contentType === "IFrameURL" && (
          <Box
            position={"relative"}
            overflow={"hidden"}
            w={"full"}
            pt={"56.25%"}
          >
            <iframe
              src={card.contentIFrameURL}
              title={card.title}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </Box>
        )}
        {card.contentType === "HTML" && (
          <Prose
            w={"full"}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        )}
      </Box>
    </Card>
  );
}
