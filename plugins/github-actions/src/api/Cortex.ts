import { CortexApi, type CortexContextResponse } from "@cortexapps/plugin-core";

export const getCortexContext = async (): Promise<CortexContextResponse> => {
  const context = await CortexApi.getContext();

  return context;
};

export const getEntityYaml = async (entityTag: string): Promise<any> => {
  const res = await CortexApi.proxyFetch(
    `http://api.local.getcortexapp.com:8080/api/v1/catalog/${entityTag}/openapi`
  );
  return await res.json();
};
