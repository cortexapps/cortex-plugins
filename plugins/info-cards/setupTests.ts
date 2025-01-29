import "@testing-library/jest-dom/extend-expect";

const mockContext = {
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
          inheritance: null,
          id: 1,
        },
      ],
    },
    tag: "inventory-planner",
    type: "service",
  },
  location: "ENTITY",
  user: {
    email: "ganesh@cortex.io",
    name: "Ganesh Datta",
    role: "ADMIN",
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
