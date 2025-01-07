import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { isNil } from "lodash";
import { usePluginContext } from "@cortexapps/plugin-core/components";
import { Heading, Box } from "@chakra-ui/react";

import Instructions from "./Instructions";
import Loading from "./Loading";
import Notice from "./Notice";
import PageSelector from "./PageSelector";

import {
  usePluginConfig,
  useCortexEntityDefinition,
  useConfluencePageContent,
} from "../hooks";

import "../baseStyles.css";

const PageContent: React.FC = () => {
  const [entityPage, setEntityPage] = useState<EntityPageI>();
  const [errorStr, setErrorStr] = useState<string>("");

  const context = usePluginContext();

  const { isLoading: isPluginConfigLoading, pluginConfig } = usePluginConfig(
    "confluence-plugin-config"
  );

  const { isLoading: isEntityDefinitionLoading, entityDefinition } =
    useCortexEntityDefinition(context.entity?.tag ?? "");

  const baseConfluenceUrl = useMemo(
    () => pluginConfig?.info?.["x-cortex-definition"]?.["confluence-url"] ?? "",
    [pluginConfig]
  );

  const entityPages = useMemo((): EntityPageI[] => {
    if (!entityDefinition) {
      return [];
    }
    const entityPages: EntityPageI[] = [];

    if (Array.isArray(entityDefinition.info?.["x-cortex-confluence"]?.pages)) {
      for (const page of entityDefinition.info["x-cortex-confluence"].pages) {
        const id = page.id as string;
        const title = page.title as string;
        if (id) {
          entityPages.push({ id, title });
        }
      }
    }

    if (entityDefinition.info?.["x-cortex-confluence"]?.pageID) {
      entityPages.push({
        id: `${entityDefinition.info["x-cortex-confluence"].pageID as string}`,
      });
    }
    return entityPages;
  }, [entityDefinition]);

  useEffect(() => {
    if (entityPages.length > 0 && !entityPage) {
      setEntityPage(entityPages[0]);
    }
  }, [entityPages, entityPage]);

  const { isLoading: isContentLoading, contents } =
    useConfluencePageContent(entityPages);

  const isLoading = useMemo(
    () =>
      isPluginConfigLoading || isEntityDefinitionLoading || isContentLoading,
    [isPluginConfigLoading, isEntityDefinitionLoading, isContentLoading]
  );

  useEffect(() => {
    if (!context.entity?.tag) {
      setErrorStr(
        "This plugin is intended to be used within entities. " +
          "Go to an entity, then under Plugins, select Confluence to view the Confluence page(s)."
      );
    }
  }, [context.entity?.tag]);

  if (isLoading) {
    return <Loading />;
  }

  if (!baseConfluenceUrl) {
    return <Instructions />;
  }

  if (errorStr) {
    return <Notice>{errorStr}</Notice>;
  }

  if (isNil(entityPage)) {
    return (
      <Notice>
        We could not find any Confluence pages associated with this entity.
      </Notice>
    );
  }

  return (
    <Box w="full" minH={600}>
      {entityPages.length > 1 && (
        <PageSelector
          currentPageId={entityPage.id}
          onChangeHandler={(pageId: string) => {
            const newEntityPage = entityPages.find(
              (page) => `${page.id as string}` === pageId
            );
            if (newEntityPage) setEntityPage(newEntityPage);
          }}
          pages={entityPages}
          disabled={isContentLoading}
        />
      )}
      <Box w="full">
        <Heading
          as="h1"
          dangerouslySetInnerHTML={{
            __html: contents[`${entityPage.id}`]?.title as string,
          }}
        />
        {contents[`${entityPage.id}`]?.body && (
          <Box
            w="full"
            dangerouslySetInnerHTML={{
              __html: contents[`${entityPage.id}`]?.body as string,
            }}
          />
        )}
        {contents[`${entityPage.id}`]?.errors && (
          <Notice>
            {contents[`${entityPage.id}`]?.errors.map((error: any) => (
              <Box display="block" key={error.code}>
                {error.title}
              </Box>
            ))}
          </Notice>
        )}
      </Box>
    </Box>
  );
};

export default PageContent;
