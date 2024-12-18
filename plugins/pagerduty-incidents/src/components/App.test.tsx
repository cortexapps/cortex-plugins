import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import App from "./App";
import { act } from "react-dom/test-utils";

describe("App", () => {
  beforeEach(() => {
    // Reset fetchMock before each test to start with a clean slate
    fetchMock.resetMocks();
  });

  it("does initial configuration when not configured", async () => {
    const mockBodies = {
      "https://api.getcortexapp.com/catalog/inventory-planner/openapi": {
        info: {
          title: "Inventory Planner",
          description: "it is a inventory planner",
          "x-cortex-tag": "inventory-planner",
          "x-cortex-type": "service",
        },
        openapi: "3.0.1",
        servers: [
          {
            url: "/",
          },
        ],
      },
      "https://api.getcortexapp.com/plugins/pagerduty-incidents": {
        description:
          "https://plugin-marketplace.s3.us-east-2.amazonaws.com/pagerduty-plugin/ui.html",
      },
      "https://api.getcortexapp.com/api/internal/v1/secrets": {},
      "https://api.getcortexapp.com/api/internal/v1/proxies": {},
      "https://plugin-marketplace.s3.us-east-2.amazonaws.com/pagerduty-plugin/ui.html":
        {},
    };

    fetchMock.mockResponse(async (req) => {
      const url = req.url.split("?")[0];
      if (url === "https://api.pagerduty.com/abilities") {
        // return success if authorization header contains our fake token
        if (req.headers.get("Authorization") === "Token token=fake_token_123") {
          return {
            status: 200,
            body: JSON.stringify({ abilities: [] }),
          };
        }
      }
      if (!mockBodies[url]) {
        return {
          status: 404,
        };
      }
      const body = mockBodies[url] || {};
      return {
        status: 200,
        body: JSON.stringify(body),
      };
    });

    const { getByText, getByLabelText, getByRole } = render(<App />);

    // Wait for initial text to load
    await waitFor(() => {
      const element = getByText(
        /To configure this plugin automatically, you need a PagerDuty API key/i
      );
      expect(element).toBeInTheDocument();
    });

    // Simulate clicking the "Configure" button to open the modal
    const configureButton = screen.getByRole("button", { name: /Configure/i });
    fireEvent.click(configureButton);

    // Simulate typing a fake token into the input field
    const tokenInput = getByLabelText(/PagerDuty REST API Token/i);
    fireEvent.change(tokenInput, { target: { value: "fake_token_123" } });

    const submitButton = getByRole("button", { name: "Submit" });
    // Wait for the Submit button to be enabled
    await waitFor(
      () => {
        expect(submitButton).not.toBeDisabled();
        expect(submitButton).toBeVisible();
      },
      { timeout: 1000 }
    );

    await act(async () => {
      // Simulate clicking the Submit button
      fireEvent.click(submitButton);
    });

    await waitFor(
      () => {
        const element = getByText(/Configuration completed successfully/i);
        expect(element).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    expect(fetch).toHaveBeenCalledWith("https://api.pagerduty.com/abilities", {
      headers: {
        Authorization: "Token token=fake_token_123",
      },
    });
  });

  it("gets no PD mapping", async () => {
    const mockBodies = {
      "https://api.getcortexapp.com/catalog/inventory-planner/openapi": {
        info: {
          title: "Inventory Planner",
          description: "it is a inventory planner",
          "x-cortex-tag": "inventory-planner",
          "x-cortex-type": "service",
        },
        openapi: "3.0.1",
        servers: [
          {
            url: "/",
          },
        ],
      },
      "https://api.pagerduty.com/abilities": {
        abilities: [],
      },
      "https://api.pagerduty.com/services/PXXXXXX": {
        service: {
          id: "PXXXXXX",
          type: "service",
          summary: "My Application Service",
          self: "https://api.pagerduty.com/services/PXXXXXX",
          html_url: "https://subdomain.pagerduty.com/service-directory/PXXXXXX",
          name: "My Application Service",
          auto_resolve_timeout: 14400,
          acknowledgement_timeout: 600,
          created_at: "2015-11-06T11:12:51-05:00",
          status: "active",
          alert_creation: "create_alerts_and_incidents",
          integrations: [],
          escalation_policy: {
            id: "PYYYYYY",
            type: "escalation_policy_reference",
            summary: "Another Escalation Policy",
            self: "https://api.pagerduty.com/escalation_policies/PYYYYYY",
            html_url:
              "https://subdomain.pagerduty.com/escalation_policies/PYYYYYY",
          },
          teams: [],
        },
      },
      "https://api.pagerduty.com/oncalls": {
        oncalls: [],
      },
      "https://api.pagerduty.com/services": {
        services: [
          {
            id: "PXXXXXX",
            type: "service",
            summary: "My Application Service",
            self: "https://api.pagerduty.com/services/PXXXXXX",
            html_url:
              "https://subdomain.pagerduty.com/service-directory/PXXXXXX",
            name: "My Application Service",
            auto_resolve_timeout: 14400,
            acknowledgement_timeout: 600,
            created_at: "2015-11-06T11:12:51-05:00",
            status: "active",
            alert_creation: "create_alerts_and_incidents",
            integrations: [],
            escalation_policy: {
              id: "PYYYYYY",
              type: "escalation_policy_reference",
              summary: "Another Escalation Policy",
              self: "https://api.pagerduty.com/escalation_policies/PYYYYYY",
              html_url:
                "https://subdomain.pagerduty.com/escalation_policies/PYYYYYY",
            },
            teams: [],
          },
        ],
      },
    };

    fetchMock.mockResponse(async (req) => {
      const url = req.url.split("?")[0];
      if (!mockBodies[url]) {
        return {
          status: 404,
        };
      }
      const body = mockBodies[url];
      return {
        status: 200,
        body: JSON.stringify(body),
      };
    });

    const { getByText } = render(<App />);

    await waitFor(() => {
      const element = getByText(/Select a service/);
      expect(element).toBeInTheDocument();
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(
          /https:\/\/api\.getcortexapp\.com\/catalog\/inventory-planner\/gitops-logs/
        )
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(
          /https:\/\/api\.getcortexapp\.com\/catalog\/inventory-planner\/openapi/
        )
      );
    });
  });

  it("gets a PD mapping but no oncall", async () => {
    const mockBodies = {
      "https://api.getcortexapp.com/catalog/inventory-planner/openapi": {
        info: {
          title: "Inventory Planner",
          description: "it is a inventory planner",
          "x-cortex-tag": "inventory-planner",
          "x-cortex-type": "service",
          "x-cortex-oncall": {
            pagerduty: {
              id: "PXXXXXX",
              type: "SERVICE",
            },
          },
        },
        openapi: "3.0.1",
        servers: [
          {
            url: "/",
          },
        ],
      },
      "https://api.pagerduty.com/services/PXXXXXX": {
        service: {
          id: "PXXXXXX",
          type: "service",
          summary: "My Application Service",
          self: "https://api.pagerduty.com/services/PXXXXXX",
          html_url: "https://subdomain.pagerduty.com/service-directory/PXXXXXX",
          name: "My Application Service",
          auto_resolve_timeout: 14400,
          acknowledgement_timeout: 600,
          created_at: "2015-11-06T11:12:51-05:00",
          status: "active",
          alert_creation: "create_alerts_and_incidents",
          integrations: [],
          escalation_policy: {
            id: "PYYYYYY",
            type: "escalation_policy_reference",
            summary: "Another Escalation Policy",
            self: "https://api.pagerduty.com/escalation_policies/PYYYYYY",
            html_url:
              "https://subdomain.pagerduty.com/escalation_policies/PYYYYYY",
          },
          teams: [],
        },
      },
      "https://api.pagerduty.com/oncalls": {
        oncalls: [],
      },
      "https://api.pagerduty.com/services": {
        services: [],
      },
    };

    fetchMock.mockResponse(async (req) => {
      const url = req.url.split("?")[0];
      const body = mockBodies[url] || {};
      return {
        status: 200,
        body: JSON.stringify(body),
      };
    });

    const { getByText } = render(<App />);

    await waitFor(() => {
      const element = getByText(
        /No PagerDuty oncalls were found for this entity/
      );
      expect(element).toBeInTheDocument();
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(
          /https:\/\/api\.getcortexapp\.com\/catalog\/inventory-planner\/gitops-logs/
        )
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(
          /https:\/\/api\.getcortexapp\.com\/catalog\/inventory-planner\/openapi/
        )
      );
      expect(fetch).toHaveBeenCalledWith(
        "https://api.pagerduty.com/services/PXXXXXX",
        {
          headers: {
            Accept: "application/vnd.pagerduty+json;version=2",
          },
        }
      );
    });
  });
});
