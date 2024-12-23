export const fetchConfluencePageContent = async (
  baseConfluenceUrl: string,
  pageId: string | number
): Promise<any> => {
  const jiraURL = `${baseConfluenceUrl}/wiki/rest/api/content/${pageId}?expand=body.view`;
  let contentResult;
  try {
    contentResult = await fetch(jiraURL);
  } catch (error: any) {
    throw new Error(
      `Network error while fetching Confluence page with ID ${pageId}: ${
        (error as Error).message
      }`
    );
  }
  if (!contentResult.ok) {
    let errorStr = "";
    try {
      if (
        contentResult.headers.get("content-type")?.includes("application/json")
      ) {
        const contentJSON: { message?: string } = await contentResult.json();
        errorStr = `Failed to fetch Confluence page with ID ${pageId}: ${
          contentJSON.message ?? JSON.stringify(contentJSON)
        }`;
      } else {
        errorStr = await contentResult.text();
      }
    } catch {
      errorStr = contentResult.statusText || "Failed to fetch Confluence page";
    }
    throw new Error(errorStr);
  }
  return contentResult.json();
};
