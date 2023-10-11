import { CortexApi, type CortexContextResponse } from "@cortexapps/plugin-core";

export const getCortexContext = async (): Promise<CortexContextResponse> => {
  const context = await CortexApi.getContext();

  return context;
};
