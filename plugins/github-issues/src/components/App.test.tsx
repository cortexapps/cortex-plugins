import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

fetchMock.mockResponse(
  JSON.stringify({
      })
);
describe("App", () => {
  it("verifies that the plugin works", async () => {
    render(<App />);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.getcortexapp.com/catalog/inventory-planner/openapi"
    );
    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });
  });
});
