export const getEntityYaml = async (entityTag: string): Promise<any> => {
  const res = await fetch(
    `http://api.local.getcortexapp.com:8080/api/v1/catalog/${entityTag}/openapi`
  );
  return await res.json();
};
