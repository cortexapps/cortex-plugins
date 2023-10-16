import { render } from "@testing-library/react";
import App from "./App";



describe("App", () => {
  it("Tests that the plugin works", () => {
    fetchMock.mockResponse(
      JSON.stringify({
        value:
           "https://docs.google.com/forms/d/e/1FAIpQLSd068wYDvfxbhB75fTx-KM7aWb9gNiLLcnjA6SQ4ulT9SLgqA/viewform?embedded=true",
      })
    );
    render(<App />);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.getcortexapp.com/catalog/inventory-planner/openapi"
    );
  });
});
