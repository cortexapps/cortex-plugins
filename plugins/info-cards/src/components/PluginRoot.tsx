import { useState, useEffect, useCallback } from "react";

import { Loader } from "@cortexapps/plugin-core/components";

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

  useEffect(() => {
    if (pluginConfig?.info?.["x-cortex-definition"]?.infoRows) {
      setInfoRows(pluginConfig.info["x-cortex-definition"].infoRows);
    }
  }, [pluginConfig]);

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
      } catch (error) {
        console.error(error);
      }
    };

    void doSave();
  }, [infoRows, pluginConfig, savePluginConfig]);

  if (configIsLoading) {
    return <Loader />;
  }

  const toggleEditor = (): void => {
    setIsEditorPage((prev) => !prev);
  };

  return (
    <>
      {isEditorPage ? (
        <LayoutBuilder
          toggleEditor={toggleEditor}
          infoRows={infoRows}
          setInfoRows={setInfoRows}
          onSubmit={handleSubmit}
        />
      ) : (
        <LandingPage toggleEditor={toggleEditor} infoRows={infoRows} />
      )}
    </>
  );
}
