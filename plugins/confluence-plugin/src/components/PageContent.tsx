// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import React, { useState, useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
// import React from "react";
import { isEmpty, isNil } from "lodash";
import "../baseStyles.css";
import {
  Box,
  Text,
  usePluginContext,
} from "@cortexapps/plugin-core/components";
import { getEntityYaml } from "../api/Cortex";
import { getConfluenceDetailsFromEntity } from "../lib/parseEntity";

const baseConfluenceUrl = "https://cortex-se-test.atlassian.net";

const PageContent: React.FC = () => {
  const [pageContent, setPageContent] = useState<string | undefined>();
  const [pageTitle, setPageTitle] = useState<string | undefined>();
  const [entityPage, setEntityPage] = useState<any | string>();

  const context = usePluginContext();

  useEffect(() => {
    const fetchEntityYaml = async (): Promise<void> => {
      const entityTag = context.entity?.tag;
      if (!isNil(entityTag)) {
        try {
          const yaml = await getEntityYaml(context.apiBaseUrl, entityTag);
          const pageID = isEmpty(yaml)
            ? undefined
            : getConfluenceDetailsFromEntity(yaml);
          if (!pageID?.pageID) {
            throw new Error("No Confluence details for entity");
          }
          setEntityPage(pageID?.pageID);
          const jiraURL = `${baseConfluenceUrl}/wiki/rest/api/content/${pageID.pageID}?expand=body.view`;
          const contentResult = await fetch(jiraURL);
          const contentJSON = await contentResult.json();
          setPageContent(contentJSON.body.view.value);
          setPageTitle(contentJSON.title);
        } catch (e) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          throw new Error(`Error fetching Confluence page: ${e}`);
        }
      }
    };
    void fetchEntityYaml();
  }, [context.apiBaseUrl, context.entity?.tag]);

  return (
    <div>
      {isNil(entityPage) ? (
        <Box backgroundColor="light" padding={3} borderRadius={2}>
          <Text>
            We could not find any Confluence page associated with this entity
          </Text>
        </Box>
      ) : (
        <div>
          <h1 dangerouslySetInnerHTML={{ __html: pageTitle as string }}></h1>
          <p dangerouslySetInnerHTML={{ __html: pageContent as string }}></p>
        </div>
      )}
    </div>
  );
};

export default PageContent;
