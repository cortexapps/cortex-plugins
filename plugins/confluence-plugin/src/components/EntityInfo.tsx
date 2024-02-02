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

const EntityInfo: React.FC = () => {
  const [pageContent, setPageContent] = useState<string | undefined>();
  const [pageTitle, setPageTitle] = useState<string | undefined>();
  const [entityPage, setEntityPage] = useState<any | string>();

  const context = usePluginContext();

  useEffect(() => {
    const fetchEntityYaml = async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const entityTag = context.entity?.tag;
      if (!isNil(entityTag)) {
        const yaml = await getEntityYaml(context.apiBaseUrl, entityTag);
        const pageID = isEmpty(yaml)
          ? undefined
          : getConfluenceDetailsFromEntity(yaml);
        setEntityPage(pageID?.pageID);
        const baseJIRAUrl = "https://cortex-se-test.atlassian.net";
        const jiraURL =
          baseJIRAUrl +
          "/wiki/rest/api/content/" +
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          pageID?.pageID +
          "?expand=body.view";
        const contentResult = await fetch(jiraURL);
        const contentJSON = await contentResult.json();
        setPageContent(contentJSON.body.view.value);
        setPageTitle(contentJSON.title);
      }
    };
    void fetchEntityYaml();
  }, []);

  return (
    <div>
      {isNil(entityPage) ? (
        <Box backgroundColor="light" padding={3} borderRadius={2}>
          <Text>
            We could not find any Confluence Page associated with this entity
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

export default EntityInfo;
