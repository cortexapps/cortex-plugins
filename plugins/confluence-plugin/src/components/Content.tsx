import {useCallback, useState, useEffect} from "react";
import type React from "react";
import { isNil, isEmpty } from "lodash";
import { Loader, usePluginContext } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import { PluginContextLocation } from "@cortexapps/plugin-core";
import { getEntityYaml } from "../api/Cortex";
import { getConfluenceDetailsFromEntity } from "../lib/parseEntity";

// Set the default confluence page. This is what get's displayed if the plugin is viewed in the 'global'
// context or viewed from within an entity that does not have the custom field key 'confluence'
const baseJIRAUrl = 'https://cortex-se-test.atlassian.net';
// const defaultPage = baseJIRAUrl + '/wiki/rest/api/content/131073?expand=body.view';
const defaultPage = '131073';
let pageContent:string = '';
let pageTitle:string = '';

const Content: React.FC = () => {
  const context = usePluginContext();
  const [entityYaml, setEntityYaml] = useState<
    Record<string, any> | undefined >();
  const [entityPage, setEntityPage] = useState<string|any>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
 
  // If the plugin is running inside an entity, let's get the Spec and check for a confluence page id
  if (context.location === PluginContextLocation.Entity) {           
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fetchEntityYaml = useCallback(async () => {
      const entityTag = context.entity?.tag;  
      if (!isNil(entityTag)) {
        const yaml = await getEntityYaml(context.apiBaseUrl, entityTag);
        setEntityYaml(yaml);
      }
    }, [context.apiBaseUrl, context.entity?.tag]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      void fetchEntityYaml();
    }, [fetchEntityYaml]);
    const pageID  = isEmpty(entityYaml) ? undefined : getConfluenceDetailsFromEntity(entityYaml);
    if (!isNil(pageID)){
      setEntityPage(pageID)
    }
  }
  console.log(entityPage)
  const fetchPageContent = async (): Promise<void> => {
    if (isEmpty(entityPage)){
      setEntityPage(defaultPage);      
    }
    const jiraURL = baseJIRAUrl + '/wiki/rest/api/content/'+ JSON.stringify(entityPage).replace(/['"]+/g, '') +'?expand=body.view'
    const contentResult = await fetch(jiraURL);
    const contentJSON = await contentResult.json();
    pageContent = contentJSON.body.view.value
    pageTitle = contentJSON.title
    setIsLoading(false);
  };
  void fetchPageContent();

  return (
   isLoading ? (
    <Loader />
  ) : (
    <div>
      <h1 dangerouslySetInnerHTML={{__html: pageTitle}}></h1>
      <p dangerouslySetInnerHTML={{__html: pageContent}}></p>
    </div>
  )
  );
};
export default Content;