import { render, screen, waitFor } from "@testing-library/react";
import EntityGitInfo from "./EntityGitInfo";

fetchMock.mockIf(
  /^https:\/\/api\.getcortexapp\.com\/catalog\/.*/,
  async (_req: Request) => {
    return await Promise.resolve(
      JSON.stringify({
        info: {},
      })
    );
  }
);

describe("EntityGitInfo", () => {
  it("Shows message when no GitHub info found", async () => {
    render(<EntityGitInfo />);

    await waitFor(() => {
      expect(
        screen.queryByText("No GitHub details were found for this entity")
      ).toBeInTheDocument();
    });
  });
});
