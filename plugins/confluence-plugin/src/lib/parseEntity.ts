export const getConfluenceDetailsFromEntity = (
  entity: Record<string, any>
): EntityPageI[] => {
  const confluenceInfo = entity.info["x-cortex-confluence"];
  if (!confluenceInfo) {
    return [];
  }

  if (Array.isArray(confluenceInfo.pages) && confluenceInfo.pages.length > 0) {
    return confluenceInfo.pages;
  }

  if (typeof confluenceInfo.pageID !== "undefined") {
    return [{ id: confluenceInfo.pageID }];
  }

  return [];
};
