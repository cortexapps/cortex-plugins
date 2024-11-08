import { render, screen, waitFor } from "@testing-library/react";

import fetchMock from "jest-fetch-mock";
import { successMockBodies } from "../mocks/mockBodies";

import App from "./App";

describe("App", () => {
  beforeEach(() => {
    // Reset fetchMock before each test to start with a clean slate
    fetchMock.resetMocks();
  });

  it("tries to fetch", async () => {
    fetchMock.mockResponse(async (req) => {
      const url = req.url.split("?")[0];
      return {
        status: 200,
        body: JSON.stringify(successMockBodies[url]),
      };
    });

    render(<App />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://api.cortex.dev/catalog/servicenow-plugin-config/openapi"
      );
      expect(fetch).toHaveBeenCalledWith(
        "https://api.cortex.dev/catalog/inventory-planner/openapi"
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(
          /https:\/\/unit-testing-snow-instance\.service-now\.com\/api\/now\/table\/cmdb_ci_service/
        )
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(
          /https:\/\/unit-testing-snow-instance\.service-now\.com\/api\/now\/table\/incident/
        )
      );
    });
  });

  it("displays incidents", async () => {
    fetchMock.mockResponse(async (req) => {
      const url = req.url.split("?")[0];
      return {
        status: 200,
        body: JSON.stringify(successMockBodies[url]),
      };
    });

    render(<App />);

    await waitFor(() => {
      const element = screen.getByText("Unable to connect to email", {
        selector: "p",
      });
      expect(element).toBeInTheDocument();
    });
  });

  it("fails to display incidents", async () => {
    fetchMock.mockResponse(async () => {
      return {
        status: 200,
        body: JSON.stringify({}),
      };
    });

    render(<App />);

    await waitFor(() => {
      const element = screen.getByText(
        "This plugin will fetch incidents from ServiceNow and display them here.",
        { selector: "p" }
      );
      expect(element).toBeInTheDocument();
    });
  });
});
