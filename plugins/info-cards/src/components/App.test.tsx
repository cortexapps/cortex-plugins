import { render, screen, waitFor } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import App from "./App";
import { act } from "react-dom/test-utils";

describe("App", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  it("shows instructions when it's not configured", async () => {
    fetchMock.mockResponse(async (req) => {
      if (
        req.url ===
        "https://api.cortex.dev/catalog/info-cards-plugin-config/openapi"
      ) {
        return {
          status: 200,
          body: JSON.stringify({
            openapi: "3.0.1",
            info: {
              title: "Info Cards Plugin",
              description: "it is an awesome plugin",
              "x-cortex-tag": "info-cards-plugin",
              "x-cortex-type": "plugin-configuration",
            },
          }),
        };
      }
      return {
        status: 404,
      };
    });
    act(() => {
      render(<App />);
    });

    await waitFor(() => {
      expect(
        screen.queryByText(
          /To get started, please configure the layout and cards in the editor/
        )
      ).toBeInTheDocument();
    });
  });

  it("shows content when it's configured", async () => {
    fetchMock.mockResponse(async (req) => {
      if (
        req.url ===
        "https://api.cortex.dev/catalog/info-cards-plugin-config/openapi"
      ) {
        return {
          status: 200,
          body: JSON.stringify({
            openapi: "3.0.1",
            info: {
              title: "Info Cards Plugin",
              description: "it is an awesome plugin",
              "x-cortex-tag": "info-cards-plugin",
              "x-cortex-type": "plugin-configuration",
              "x-cortex-definition": {
                infoRows: [
                  {
                    id: 1734449412873,
                    cards: [
                      {
                        id: 1734449414053,
                        rowId: 1734449412873,
                        title: "meeps",
                        contentHTML: "<h1>meeps</h1>",
                        contentType: "HTML",
                      },
                      {
                        id: 1734459065666,
                        rowId: 1734449412873,
                        title: "woot",
                        contentIFrameURL: "https://example.com",
                        contentType: "IFrameURL",
                      },
                    ],
                  },
                ],
              },
            },
          }),
        };
      }
      return {
        status: 404,
      };
    });

    act(() => {
      render(<App />);
    });

    await waitFor(() => {
      const heading = screen.getByRole("heading", { level: 1, name: /meeps/i });
      expect(heading).toBeInTheDocument();

      const iframe = screen.getByTitle("woot");
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute("src", "https://example.com");
    });
  });
});
