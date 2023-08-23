import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

fetchMock.mockIf(
  /^https:\/\/api\.github\.com\/repos\/.*/,
  async (_req: Request) => {
    return await Promise.resolve(JSON.stringify({}));
  }
);

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

describe("App", () => {
  it("indicates that it's an awesome plugin", async () => {
    render(<App />);

    expect(screen.queryByText("GitHub Releases")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Git info")).toBeInTheDocument();
    });
  });
});
