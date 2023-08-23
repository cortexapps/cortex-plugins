import { render, screen, waitFor } from "@testing-library/react";
import EntityGitInfo from "./EntityGitInfo";

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

describe("EntityGitInfo", () => {
  it("renders fairly blank if there is no git info for the entity", async () => {
    render(<EntityGitInfo />);

    await waitFor(() => {
      expect(screen.queryByText("Git info")).toBeInTheDocument();
    });
  });

  it("renders GitHub info if defined on the entity yaml", async () => {
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

    render(<EntityGitInfo />);

    await waitFor(() => {
      expect(screen.queryByText("Git info")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });

    expect(
      screen.queryByText('{"owner":"cortexapps","repo":"plugin-core"}')
    ).toBeInTheDocument();
  });
});
