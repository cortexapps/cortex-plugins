import type React from "react";
import { useState, useEffect } from "react";
import { isEmpty, isNil } from "lodash";
import "../baseStyles.css";
import {
  Box,
  Text,
  usePluginContext,
} from "@cortexapps/plugin-core/components";
import { getEntityYaml } from "../api/Cortex";
import { getConfluenceDetailsFromEntity } from "../lib/parseEntity";

import Instructions from "./Instructions";

const PageContent: React.FC = () => {
  const [pageContent, setPageContent] = useState<string | undefined>();
  const [pageTitle, setPageTitle] = useState<string | undefined>();
  const [entityPage, setEntityPage] = useState<any | string>();
  const [baseConfluenceUrl, setBaseConfluenceUrl] = useState<string>("");
  const [errorStr, setErrorStr] = useState<string>("");

  const context = usePluginContext();

  useEffect(() => {
    if (!context?.apiBaseUrl) {
      return;
    }
    const getConfluencePluginConfig = async (): Promise<void> => {
      setErrorStr("loading");
      if (!context?.apiBaseUrl) {
        return;
      }
      let newConfluenceUrl = "";
      try {
        const response = await fetch(
          `${context?.apiBaseUrl}/catalog/confluence-plugin-config/openapi`
        );
        const data = await response.json();
        newConfluenceUrl = data.info["x-cortex-definition"]["confluence-url"];
      } catch (e) {}
      setBaseConfluenceUrl(newConfluenceUrl);
      if (!newConfluenceUrl) {
        setErrorStr("instructions");
      }
    };
    void getConfluencePluginConfig();
  }, [context?.apiBaseUrl]);

  useEffect(() => {
    if (!context.apiBaseUrl || !context.entity?.tag || !baseConfluenceUrl) {
      return;
    }
    const fetchEntityYaml = async (): Promise<void> => {
      const entityTag = context.entity?.tag;
      if (!isNil(entityTag)) {
        try {
          const yaml = await getEntityYaml(context.apiBaseUrl, entityTag);
          const pageID = isEmpty(yaml)
            ? undefined
            : getConfluenceDetailsFromEntity(yaml);
          if (!pageID?.pageID) {
            setErrorStr("No Confluence details exist on this entity.");
            return;
          }
          setEntityPage(pageID?.pageID);
          const jiraURL = `${baseConfluenceUrl}/wiki/rest/api/content/${pageID.pageID}?expand=body.view`;
          const contentResult = await fetch(jiraURL);
          if (!contentResult.ok) {
            let newErrorStr = "";
            // if the contentResult contains valid JSON, we can use it to display an error message
            try {
              if (
                contentResult.headers
                  .get("content-type")
                  ?.includes("application/json")
              ) {
                const contentJSON = await contentResult.json();
                const msg: string =
                  contentJSON.message || JSON.stringify(contentJSON);
                newErrorStr = `Failed to fetch Confluence page with ID ${pageID.pageID}: ${msg}`;
              } else {
                // just get the text if it's not JSON
                const contentText = await contentResult.text();
                newErrorStr = contentText;
              }
            } catch (e) {
              // if we can't parse the content, just use the status text
              newErrorStr =
                contentResult.statusText || "Failed to fetch Confluence page";
            }
            setErrorStr(newErrorStr);
            return;
          }
          const contentJSON = await contentResult.json();
          setPageContent(contentJSON.body.view.value);
          setPageTitle(contentJSON.title);
          setErrorStr("");
        } catch (e) {
          // This will still result in a "We could not find any Confluence page" error in the UI, but may as well trap in console as well
          const msg: string = e.message || e.toString();
          setErrorStr(`Error retrieving Confluence page: ${msg}`);
          console.error("Error retrieving Confluence page: ", e);
        }
      }
    };
    void fetchEntityYaml();
  }, [context.apiBaseUrl, context.entity?.tag, baseConfluenceUrl]);

  if (errorStr === "loading") {
    return <div>Loading...</div>;
  } else if (errorStr === "instructions") {
    return <Instructions />;
  } else if (errorStr) {
    return (
      <Box backgroundColor="light" padding={3} borderRadius={2}>
        <Text>{errorStr}</Text>
      </Box>
    );
  }

  if (isNil(entityPage)) {
    return (
      <Box backgroundColor="light" padding={3} borderRadius={2}>
        <Text>
          We could not find any Confluence page associated with this entity.
        </Text>
      </Box>
    );
  }

  return (
    <div>
      <h1 dangerouslySetInnerHTML={{ __html: pageTitle as string }}></h1>
      <p dangerouslySetInnerHTML={{ __html: pageContent as string }}></p>
    </div>
  );
};

export default PageContent;
