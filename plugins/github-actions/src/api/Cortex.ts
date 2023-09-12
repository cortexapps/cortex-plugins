export const getEntityYaml = async (
  apiBaseUrl: string,
  entityTag: string
): Promise<any> => {
  const res = await fetch(`${apiBaseUrl}/catalog/${entityTag}/openapi`);
  return await res.json();
};
