import { useState, useEffect, useCallback, useMemo } from "react";

import { Loader } from "@cortexapps/plugin-core/components";

import { useToast, Text } from "@chakra-ui/react";

import type { InfoRowI } from "../typings";

import LandingPage from "./LandingPage";
import LayoutBuilder from "./LayoutBuilder";

import { useEntityDescriptor } from "../hooks";

export default function PluginRoot(): JSX.Element {
  const [isEditorPage, setIsEditorPage] = useState(false);
  const [infoRows, setInfoRows] = useState<InfoRowI[]>([]);

  const {
    isLoading: configIsLoading,
    isFetching: configIsFetching,
    isMutating: configIsMutating,
    entity: pluginConfig,
    updateEntity: savePluginConfig,
  } = useEntityDescriptor({
    entityTag: "info-cards-plugin-config",
  });

  const toast = useToast();

  useEffect(() => {
    if (pluginConfig?.info?.["x-cortex-definition"]?.infoRows) {
      setInfoRows(pluginConfig.info["x-cortex-definition"].infoRows);
    }
  }, [pluginConfig, isEditorPage]);

  const isModified: boolean = useMemo(() => {
    const existingInfoRows =
      pluginConfig?.info?.["x-cortex-definition"]?.infoRows || [];
    const isModified =
      JSON.stringify(infoRows) !== JSON.stringify(existingInfoRows);
    return Boolean(isModified);
  }, [infoRows, pluginConfig]);

  const toggleEditor = useCallback(() => {
    setInfoRows(pluginConfig?.info?.["x-cortex-definition"]?.infoRows || []);
    setIsEditorPage((prev) => !prev);
  }, [pluginConfig, setInfoRows, setIsEditorPage]);

  const handleSubmit = useCallback(() => {
    const doSave = async (): Promise<void> => {
      try {
        savePluginConfig({
          ...pluginConfig,
          info: {
            ...pluginConfig?.info,
            "x-cortex-definition": {
              ...(pluginConfig?.info?.["x-cortex-definition"] || {}),
              infoRows: [...infoRows],
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
  }, [infoRows, pluginConfig, savePluginConfig, toast, toggleEditor]);

  if (configIsLoading || configIsFetching || configIsMutating) {
    return <Loader />;
  }

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
