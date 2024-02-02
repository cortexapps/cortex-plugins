// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import React, { useState, useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
// import React from "react";
import { isEmpty, isNil } from "lodash";
import "../baseStyles.css";
import { Box,Text, usePluginContext } from "@cortexapps/plugin-core/components";
import { getEntityYaml } from "../api/Cortex";
import { getConfluenceDetailsFromEntity } from "../lib/parseEntity";


const EntityInfo: React.FC = () => {
  const [pageContent, setPageContent] = useState<string | undefined>();
  const [pageTitle, setPageTitle] = useState<string | undefined>();
  const [entityPage, setEntityPage] = useState<any | string>();
  const [entityYaml, setEntityYaml] = useState<
    Record<string, any> | undefined
  >();
  const context = usePluginContext();

  useEffect(() => {
    const fetchEntityYaml = async (): Promise<void> => {
      console.log("about to get the yaml");
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const entityTag = context.entity?.tag;
      console.log(entityTag);
      if (!isNil(entityTag)) {
        const yaml = await getEntityYaml(context.apiBaseUrl, entityTag);
        console.log(yaml);
        setEntityYaml(yaml);
        console.log("about to shoe yaml");
        console.log(entityYaml);
        const pageID = isEmpty(yaml)
          ? undefined
          : getConfluenceDetailsFromEntity(yaml);
        console.log(pageID);
        setEntityPage(pageID?.pageID);
        const baseJIRAUrl = "https://cortex-se-test.atlassian.net";
        const jiraURL =
          baseJIRAUrl +
          "/wiki/rest/api/content/" +
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          pageID?.pageID +
          "?expand=body.view";
        console.log(jiraURL);
        const contentResult = await fetch(jiraURL);
        console.log(contentResult);
        const contentJSON = await contentResult.json();
        console.log(contentJSON);
        setPageContent(contentJSON.body.view.value);
        setPageTitle(contentJSON.title);
      }
    };
    void fetchEntityYaml();
  }, []);

  return (
    <div>
      <Text>Helo</Text>
      <br />
      <Text>{entityPage}</Text>
     {isNil(entityPage) ?(
    <Box backgroundColor="light" padding={3} borderRadius={2}>
      <Text>
        We could not find any Confluence Page associated with this entity
      </Text>
    </Box>
  ): (
    <div>
      <h1 dangerouslySetInnerHTML={{ __html: pageTitle as string }}></h1>
      <p dangerouslySetInnerHTML={{ __html: pageContent as string }}></p>
    </div>
  ) }

    </div>
  );
};

export default EntityInfo;
