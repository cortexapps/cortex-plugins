import { render, waitFor } from "@testing-library/react";

import fetchMock from "jest-fetch-mock";

import App from "./App";
describe("App", () => {
  beforeEach(() => {
    // Reset fetchMock before each test to start with a clean slate
    fetchMock.resetMocks();
  });

  it("gets no pd mapping", async () => {
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
        /This entity is not associated with any PagerDuty service./
      );
      expect(element).toBeInTheDocument();
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
          /https:\/\/api\.getcortexapp\.com\/catalog\/inventory-planner\/openapi/
        )
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/https:\/\/api\.pagerduty.com\/services/)
      );
    });
  });
});
