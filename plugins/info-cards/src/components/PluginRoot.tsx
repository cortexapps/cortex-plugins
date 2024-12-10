import { useState } from "react";
import LayoutBuilder from "./LayoutBuilder";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./ui/theme";
import LandingPage from "./LandingPage";
import type { InfoCardI, InfoRowI } from "../typings";

export default function PluginRoot(): JSX.Element {
  const [isEditorPage, setIsEditorPage] = useState(false);
  const [infoRows, setInfoRows] = useState<InfoRowI[]>([]);
  const [infoCards, setInfoCards] = useState<InfoCardI[]>([]);

  const toggleEditor = (): void => {
    setIsEditorPage((prev) => !prev);
  };

  return (
    <ChakraProvider
      theme={theme}
      toastOptions={{ defaultOptions: { position: "top" } }}
    >
      {isEditorPage ? (
        <LayoutBuilder
          toggleEditor={toggleEditor}
          infoCards={infoCards}
          setInfoCards={setInfoCards}
          infoRows={infoRows}
          setInfoRows={setInfoRows}
        />
      ) : (
        <LandingPage
          toggleEditor={toggleEditor}
          infoCards={infoCards}
          infoRows={infoRows}
        />
      )}
    </ChakraProvider>
  );
}
