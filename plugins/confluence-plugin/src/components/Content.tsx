import { useState, useEffect } from "react";
import type React from "react";
import { isEmpty } from "lodash";
import { Box, Text, Loader } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";

interface ConfluencePageProps {
  pageID: string;
}

const Content: React.FC<ConfluencePageProps> = ({ pageID }) => {
  const [pageContent, setPageContent] = useState<string | undefined>();
  const [pageTitle, setPageTitle] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPageContent = async (): Promise<void> => {
      try {
        const baseJIRAUrl = "https://cortex-se-test.atlassian.net";
        const jiraURL =
          baseJIRAUrl +
          "/wiki/rest/api/content/" +
          pageID +
          "?expand=body.view";
        console.log(jiraURL);
        const contentResult = await fetch(jiraURL);
        console.log(contentResult);
        const contentJSON = await contentResult.json();
        console.log(contentJSON);
        setPageContent(contentJSON.body.view.value);
        setPageTitle(contentJSON.title);
      } catch (err) {
        console.error(`Error fetching issues:`, err);
      }

      setIsLoading(false);
    };
    void fetchPageContent();
  }, []);

  return isLoading ? (
    <Loader />
  ) : !isEmpty(pageID) ? (
    <div>
      <h1 dangerouslySetInnerHTML={{ __html: pageTitle as string }}></h1>
      <p dangerouslySetInnerHTML={{ __html: pageContent as string }}></p>
    </div>
  ) : (
    <Box backgroundColor="light" padding={3} borderRadius={2}>
      <Text>
        We could not find any Confluence Page associated with this entity
      </Text>
    </Box>
  );
};
export default Content;
