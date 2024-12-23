import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { isEmpty, isNil } from "lodash";
import "../baseStyles.css";
import { usePluginContext } from "@cortexapps/plugin-core/components";
import { getEntityYaml } from "../api/Cortex";
import { getConfluenceDetailsFromEntity } from "../lib/parseEntity";
import { Heading, Box } from "@chakra-ui/react";
import Instructions from "./Instructions";
import Loading from "./Loading";
import Notice from "./Notice";
import PageSelector from "./PageSelector";
import { fetchConfluencePageContent } from "../api/fetchConfluencePageContent";
import { fetchConfluencePluginConfig } from "../api/fetchConfluencePluginConfig";

const PageContent: React.FC = () => {
  const [entityPages, setEntityPages] = useState<EntityPageI[]>([]);
  const [pageContent, setPageContent] = useState<string | undefined>();
  const [pageTitle, setPageTitle] = useState<string | undefined>();
  const [entityPage, setEntityPage] = useState<string | number | undefined>();
  const [baseConfluenceUrl, setBaseConfluenceUrl] = useState<string>("");
  const [errorStr, setErrorStr] = useState<string>("");

  const context = usePluginContext();

  const fetchPageContent = useCallback(
    async (pages: EntityPageI[], pageId: string | number): Promise<void> => {
      if (pages.length === 0) return;
      setEntityPage(pageId);
      setErrorStr("loading-content");
      try {
        const contentJSON = await fetchConfluencePageContent(
          baseConfluenceUrl,
          pageId
        );
        setPageContent(contentJSON.body.view.value);
        setPageTitle(contentJSON.title);
        setErrorStr("");
      } catch (error) {
        setErrorStr(error.message);
      }
    },
    [baseConfluenceUrl]
  );

  useEffect(() => {
    if (!context?.apiBaseUrl) return;
    const getConfig = async (): Promise<void> => {
      setErrorStr("loading");
      try {
        const newConfluenceUrl = await fetchConfluencePluginConfig(
          context.apiBaseUrl
        );
        setBaseConfluenceUrl(newConfluenceUrl);
        setErrorStr(!newConfluenceUrl ? "instructions" : "");
      } catch {
        setErrorStr("instructions");
      }
    };
    void getConfig();
  }, [context?.apiBaseUrl]);

  useEffect(() => {
    if (!context.entity?.tag) {
      setErrorStr(
        "This plugin is intended to be used within the entities. " +
          "Go to an entity, then under Plugins, select Confluence to view the Confluence page(s)."
      );
    }

    if (!context.apiBaseUrl || !baseConfluenceUrl) {
      return;
    }

    const fetchEntityYamlData = async (): Promise<void> => {
      const entityTag = context.entity?.tag;
      if (!isNil(entityTag)) {
        try {
          setErrorStr("loading");
          const yaml = await getEntityYaml(context.apiBaseUrl, entityTag);
          const fetchedEntityPages = isEmpty(yaml)
            ? []
            : getConfluenceDetailsFromEntity(yaml);
          if (fetchedEntityPages.length === 0) {
            setErrorStr("No Confluence details exist on this entity.");
            return;
          }
          setEntityPages(fetchedEntityPages);
        } catch (error) {
          setErrorStr(
            `Error retrieving Confluence page: ${(error as Error).message}`
          );
          console.error("Error retrieving Confluence page: ", error);
        }
      }
    };
    void fetchEntityYamlData();
  }, [context.apiBaseUrl, context.entity?.tag, baseConfluenceUrl]);

  useEffect(() => {
    const setFirstPageContent = async (): Promise<void> => {
      if (entityPages.length === 0) return;
      await fetchPageContent(entityPages, entityPages[0].id);
    };
    void setFirstPageContent();
  }, [baseConfluenceUrl, entityPages, fetchPageContent]);

  if (errorStr === "loading") return <Loading />;
  if (errorStr === "instructions") return <Instructions />;
  if (errorStr && errorStr !== "loading-content")
    return <Notice>{errorStr}</Notice>;

  if (isNil(entityPage)) {
    return (
      <Notice>
        We could not find any Confluence page associated with this entity.
      </Notice>
    );
  }

  return (
    <Box w="full" minH={600}>
      {entityPages.length > 1 && (
        <PageSelector
          currentPageId={entityPage}
          onChangeHandler={fetchPageContent}
          pages={entityPages}
          disabled={errorStr === "loading-content"}
        />
      )}
      {errorStr === "loading-content" ? (
        <Loading />
      ) : (
        <Box w="full">
          <Heading
            as="h1"
            dangerouslySetInnerHTML={{ __html: pageTitle as string }}
          />
          <Box
            w="full"
            dangerouslySetInnerHTML={{ __html: pageContent as string }}
          />
        </Box>
      )}
    </Box>
  );
};

export default PageContent;
