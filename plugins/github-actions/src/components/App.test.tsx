import { render, screen } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import App from "./App";
import { waitForLoading } from "../../../testUtils/testUtils";

// copied from https://docs.github.com/en/rest/actions/workflows?apiVersion=2022-11-28
const mockWorkflowRunsResponse = {
  total_count: 2,
  workflows: [
    {
      id: 161335,
      node_id: "MDg6V29ya2Zsb3cxNjEzMzU=",
      name: "CI",
      path: ".github/workflows/blank.yaml",
      state: "active",
      created_at: "2020-01-08T23:48:37.000-08:00",
      updated_at: "2020-01-08T23:50:21.000-08:00",
      url: "https://api.github.com/repos/octo-org/octo-repo/actions/workflows/161335",
      html_url:
        "https://github.com/octo-org/octo-repo/blob/master/.github/workflows/161335",
      badge_url: "https://github.com/octo-org/octo-repo/workflows/CI/badge.svg",
    },
    {
      id: 269289,
      node_id: "MDE4OldvcmtmbG93IFNlY29uZGFyeTI2OTI4OQ==",
      name: "Linter",
      path: ".github/workflows/linter.yaml",
      state: "active",
      created_at: "2020-01-08T23:48:37.000-08:00",
      updated_at: "2020-01-08T23:50:21.000-08:00",
      url: "https://api.github.com/repos/octo-org/octo-repo/actions/workflows/269289",
      html_url:
        "https://github.com/octo-org/octo-repo/blob/master/.github/workflows/269289",
      badge_url:
        "https://github.com/octo-org/octo-repo/workflows/Linter/badge.svg",
    },
  ],
};

describe("App", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

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

  // TODO: fix this test -- mocking requests seems all messed up
  it.skip("renders a list of workflow runs", async () => {
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
      /^https?:\/\/api\.github\.com\/repos\/cortexapps\/plugin-core\/actions*/,
      async (_req: Request) => {
        return await Promise.resolve(JSON.stringify(mockWorkflowRunsResponse));
      }
    );

    await renderApp();

    await waitForLoading();

    expect(screen.queryByText("No records to display")).not.toBeInTheDocument();
    expect(screen.queryByText("CI")).toBeInTheDocument();
  });
});
