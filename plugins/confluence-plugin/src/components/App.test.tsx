// import { render, screen, waitFor } from "@testing-library/react";
import { render, waitFor } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import App from "./App";

import { successMockBodies } from "../mocks/mockBodies";

describe("App", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("verifies that the plugin works", async () => {
    fetchMock.mockResponse(async (req) => {
      const url = req.url.split("?")[0];
      if (!successMockBodies[url]) {
        return { status: 404 };
      }
      return {
        status: 200,
        body: JSON.stringify(successMockBodies[url]),
      };
    });

    const { getByText } = render(<App />);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://api.cortex.dev/catalog/confluence-plugin-config/openapi"
      );
      expect(fetch).toHaveBeenCalledWith(
        "https://api.cortex.dev/catalog/inventory-planner/openapi"
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(
          /https:\/\/unit-testing-confluence-instance.atlassian.net.*131073.*/
        )
      );
      expect(getByText("AppDirect Runbook")).toBeInTheDocument();
    });
  });
});
