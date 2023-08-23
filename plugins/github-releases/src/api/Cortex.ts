import { CortexApi, type CortexContextResponse } from "@cortexapps/plugin-core";

export const getCortexContext = async (): Promise<CortexContextResponse> => {
  const context = await CortexApi.getContext();

  return context;
};

export const getEntityYaml = async (
  baseUrl: string,
  entityTag: string
): Promise<any> => {
  const res = await fetch(`${baseUrl}/catalog/${entityTag}/openapi`);
  return await res.json();
};
