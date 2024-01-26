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


const Content: React.FC = () => {
  const [pageContent, setPageContent] = useState<string | undefined>();
  const [pageTitle, setPageTitle] = useState<string | undefined>();
  const context = usePluginContext();
  const [entityYaml, setEntityYaml] = useState<
    Record<string, any> | undefined >();
  const [entityPage, setEntityPage] = useState<string|any>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
 
 
  const fetchEntityYaml = useCallback(async () => {
    const entityTag = context.entity?.tag;  
    if (!isNil(entityTag)) {
        const yaml = await getEntityYaml(context.apiBaseUrl, entityTag);
        setEntityYaml(yaml);
      }
  }, [context.apiBaseUrl, context.entity?.tag]);
  
  // If the plugin is running inside an entity, let's get the Spec and check for a confluence page id
  if (context.location === PluginContextLocation.Entity) {
    const pageID  = isEmpty(entityYaml) ? undefined : getConfluenceDetailsFromEntity(entityYaml);
    console.log(pageID)
    if (!isNil(pageID)){
      setEntityPage(pageID.pageID)
    }    
    
  }
  const fetchPageContent = useCallback(async (): Promise<void> => {
    if (isEmpty(entityPage)) {
      setEntityPage(defaultPage);      
    }
    const pageToRender = JSON.stringify(entityPage).replace(/['"]+/g, '')
    const jiraURL = baseJIRAUrl + '/wiki/rest/api/content/'+ pageToRender +'?expand=body.view'
    console.log(jiraURL);
    const contentResult = await fetch(jiraURL);
    const contentJSON = await contentResult.json();
    setPageContent(contentJSON.body.view.value);
    setPageTitle(contentJSON.title);
    setIsLoading(false);
  },[entityPage]);
  void fetchPageContent();
  
  useEffect(() => {
    const fetchThenFetch = async (): Promise<void> => {
      await fetchEntityYaml();
      await fetchPageContent();
    };
    void fetchThenFetch(); 
  }, [fetchEntityYaml, fetchPageContent]);

  return    isLoading ? (
    <Loader />
  ) : (
    <div>
      <h1 dangerouslySetInnerHTML={{__html: pageTitle as string}}></h1>
      <p dangerouslySetInnerHTML={{__html: pageContent as string}}></p>
    </div>
  );
  
};
export default Content;