export const getEntityYaml = async (
  baseUrl: string,
  entityTag: string
): Promise<any> => {
  const res = await fetch(`${baseUrl}/catalog/${entityTag}/openapi`);

  return await res.json();
};
