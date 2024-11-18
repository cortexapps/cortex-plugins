import { render, screen, waitFor } from "@testing-library/react";
import PageContent from "./PageContent";

import { successMockBodies, noEntityMockBodies } from "../mocks/mockBodies";

describe("PageContent", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("shows message when no page is found", async () => {
    fetchMock.mockResponse(async (req) => {
      const url = req.url.split("?")[0];
      if (!noEntityMockBodies[url]) {
        return { status: 404 };
      }
      return {
        status: 200,
        body: JSON.stringify(noEntityMockBodies[url]),
      };
    });

    render(<PageContent />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "No Confluence details exist on this entity."
        )
      ).toBeInTheDocument();
    });
  });

  it("shows a page if page is found", async () => {
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

    render(<PageContent />);
    await waitFor(() => {
      expect(screen.queryByText("AppDirect Runbook")).toBeInTheDocument();
    });
  });

  it("handles fetchEntityYaml failure", async () => {
    fetchMock.mockRejectOnce(new Error("Failed to fetch YAML"));

    render(<PageContent />);

    await waitFor(() => {
      expect(
        screen.queryByText(
          "To get started, please add an entity to Cortex like the following:"
        )
      ).toBeInTheDocument();
    });
  });

  it("renders content with dangerouslySetInnerHTML", async () => {
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

    render(<PageContent />);
    await waitFor(() => {
      expect(screen.getByText("AppDirect Runbook")).toBeInTheDocument();
      expect(screen.getByText("EVERYBODY")).toBeInTheDocument();
    });
  });
});
