import { useState, useEffect, useCallback, useMemo } from "react";

import { Loader } from "@cortexapps/plugin-core/components";

import { useToast, Text } from "@chakra-ui/react";

import type { InfoRowI } from "../typings";

import LandingPage from "./LandingPage";
import LayoutBuilder from "./LayoutBuilder";

import { usePluginConfig } from "../hooks";

export default function PluginRoot(): JSX.Element {
  const [isEditorPage, setIsEditorPage] = useState(false);
  const [infoRows, setInfoRows] = useState<InfoRowI[]>([]);

  const {
    isLoading: configIsLoading,
    pluginConfig,
    savePluginConfig,
  } = usePluginConfig();

  const toast = useToast();

  useEffect(() => {
    if (pluginConfig?.info?.["x-cortex-definition"]?.infoRows) {
      setInfoRows(pluginConfig.info["x-cortex-definition"].infoRows);
    }
  }, [pluginConfig, isEditorPage]);

  const isModified: boolean = useMemo(() => {
    const isModified =
      infoRows &&
      pluginConfig?.info?.["x-cortex-definition"]?.infoRows &&
      JSON.stringify(infoRows) !==
        JSON.stringify(pluginConfig?.info?.["x-cortex-definition"]?.infoRows);
    return Boolean(isModified);
  }, [infoRows, pluginConfig]);

  const handleSubmit = useCallback(() => {
    const doSave = async (): Promise<void> => {
      try {
        await savePluginConfig({
          ...pluginConfig,
          info: {
            ...pluginConfig.info,
            "x-cortex-definition": {
              ...(pluginConfig.info?.["x-cortex-definition"] || {}),
              infoRows,
            },
          },
        });
        toggleEditor();
        toast({
          title: "Layout Saved",
          description: "Your changes have been saved.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: `Failed to save layout: ${error.message as string}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    };

    void doSave();
  }, [infoRows, pluginConfig, savePluginConfig, toast]);

  if (configIsLoading) {
    return <Loader />;
  }

  const toggleEditor = (): void => {
    setIsEditorPage((prev) => !prev);
  };

  return (
    <>
      {isModified && (
        <Text
          size="xs"
          fontStyle={"italic"}
          position={"fixed"}
          top={0}
          right={0}
          px={2}
          py={1}
          mr={4}
          color={"red.500"}
        >
          You have unsaved changes
        </Text>
      )}
      {isEditorPage ? (
        <LayoutBuilder
          toggleEditor={toggleEditor}
          infoRows={infoRows}
          setInfoRows={setInfoRows}
          isModified={isModified}
          onSubmit={handleSubmit}
        />
      ) : (
        <LandingPage toggleEditor={toggleEditor} infoRows={infoRows} />
      )}
    </>
  );
}
