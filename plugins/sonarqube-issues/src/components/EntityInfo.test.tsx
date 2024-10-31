import { render, screen, waitFor } from "@testing-library/react";
import EntityInfo from "./EntityInfo";

describe("EntityInfo", () => {
  it("shows message when no SonarQube info found", async () => {
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
    render(<EntityInfo />);

    await waitFor(() => {
      expect(
        screen.queryByText("No SonarQube details were found for this entity")
      ).toBeInTheDocument();
    });
  });
});
