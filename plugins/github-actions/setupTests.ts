import {
  type PluginContextLocation,
  type CortexContextResponse,
  type CortexUserRole,
} from "@cortexapps/plugin-core/*";
import "@testing-library/jest-dom/extend-expect";

import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

const mockContext: CortexContextResponse = {
  apiBaseUrl: "https://api.cortex.dev",
  entity: {
    definition: null,
    description: null,
    groups: null,
    name: "Inventory planner",
    ownership: {
      emails: [
        {
          description: null,
          email: "nikhil@cortex.io",
        },
      ],
    },
    tag: "inventory-planner",
    type: "service",
  },
  location: "ENTITY" as PluginContextLocation,
  user: {
    email: "ganesh@cortex.io",
    name: "Ganesh Datta",
    role: "ADMIN" as CortexUserRole,
  },
};

jest.mock("@cortexapps/plugin-core/components", () => {
  const originalModule = jest.requireActual(
    "@cortexapps/plugin-core/components"
  );

  return {
    ...originalModule,
    usePluginContext: () => {
      return mockContext;
    },
    PluginContextProvider: ({ children }) => {
      return children;
    },
    PluginProvider: ({ children }) => {
      return children;
    },
  };
});

jest.mock("@cortexapps/plugin-core", () => {
  const originalModule = jest.requireActual("@cortexapps/plugin-core");
  return {
    ...originalModule,
    CortexApi: {
      ...originalModule.CortexApi,
      getContext: () => {
        return mockContext;
      },
    },
  };
});
