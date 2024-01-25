export const getConfluenceDetailsFromEntity = (
  entity: Record<string, any>
): { pageID: string} | undefined => {
  const pageID = entity.info["x-cortex-confluence"]?.pageID;

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!pageID) {
    return undefined;
  }


  return { pageID };
};
