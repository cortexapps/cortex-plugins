import { render, screen } from "@testing-library/react";
import App from "./App";
import { waitForLoading } from "../../../testUtils/testUtils";

jest.mock("../api/GithubActionsClient", () => {
  const originalModule = jest.requireActual("../api/GithubActionsClient");

  const mockListWorkflows = async (): Promise<any> => {
    console.log(`=== mock list workflows`);
    return await Promise.resolve(mockWorkflowRuns);
  };
  const mockGithubActionsClient = {
    listWorkflowRuns: async (): Promise<any> => {
      console.log(`======== mock list workflows`);
      return await Promise.resolve(mockWorkflowRuns);
    },
  };

  console.log(`mocking GithubActionsClient`, {
    original: originalModule.default.listWorkflowRuns,
    mock: mockListWorkflows,
  });
  return {
    ...originalModule,
    default: mockGithubActionsClient,
  };
});

fetchMock.mockIf(/\*/, async (_req: Request) => {
  console.log(`catch-all mock`, { _req });
  return await Promise.resolve(JSON.stringify({}));
});

fetchMock.mockIf(
  /^https:\/\/api\.cortex\.dev\/catalog\/.*/,
  async (_req: Request) => {
    return await Promise.resolve(
      JSON.stringify({
        info: {
          "x-cortex-git": {
            github: {
              repository: "cortexapps/plugin-core",
            },
          },
        },
      })
    );
  }
);

fetchMock.mockIf(
  // /^https:\/\/api\.github\.com\/repos\/cortexapps\/plugin-core\/actions*/,
  /^https:\/\/api\.github\.com*/,
  async (_req: Request) => {
    console.log(`==== fetching actions`, { _req });
    return await Promise.resolve(JSON.stringify([]));
  }
);

// todo: import real shape from `@octokit/types` and fix
const mockWorkflowRuns: Array<Record<string, any>> = [
  {
    display_title: "Workflow 1",
    id: "1",
    node_id: "99",
  },
];

describe("App", () => {
  const renderApp = async (): Promise<ReturnType<typeof render>> => {
    const result = render(<App />);
    await waitForLoading();
    return result;
  };

  it("renders a missing GitHub information state for a context without GitHub information", async () => {
    fetchMock.mockIf(
      /^https:\/\/api\.cortex\.dev\/catalog\/.*/,
      async (_req: Request) => {
        return await Promise.resolve(
          JSON.stringify({
            info: {},
          })
        );
      }
    );

    await renderApp();

    expect(
      screen.queryByText(/No GitHub information found for this entity/)
    ).toBeInTheDocument();
  });

  it("renders an empty list of actions", async () => {
    fetchMock.mockIf(
      /^https:\/\/api\.cortex\.dev\/catalog\/.*/,
      async (_req: Request) => {
        return await Promise.resolve(
          JSON.stringify({
            info: {
              "x-cortex-git": {
                github: {
                  repository: "cortexapps/plugin-core",
                },
              },
            },
          })
        );
      }
    );

    await renderApp();

    await waitForLoading();

    expect(screen.queryByText("No records to display")).toBeInTheDocument();
  });

  it("renders a list of workflow runs", async () => {
    fetchMock.mockIf(
      /^https:\/\/api\.cortex\.dev\/catalog\/.*/,
      async (_req: Request) => {
        return await Promise.resolve(
          JSON.stringify({
            info: {
              "x-cortex-git": {
                github: {
                  repository: "cortexapps/plugin-core",
                },
              },
            },
          })
        );
      }
    );

    await renderApp();

    await waitForLoading();

    await waitForLoading();
    screen.debug();
  });
});
