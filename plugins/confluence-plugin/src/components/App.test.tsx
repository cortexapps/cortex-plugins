import { render } from "@testing-library/react";
import App from "./App";
import { waitForLoading } from "../../../testUtils/testUtils";

fetchMock.mockResponse(JSON.stringify({}));
describe("App", () => {
  it("verifies that the plugin works", async () => {
    render(<App />);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.getcortexapp.com/catalog/inventory-planner/openapi"
    );
    await waitForLoading();
  });
});
