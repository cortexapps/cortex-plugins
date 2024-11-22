import { render, waitFor } from "@testing-library/react";
import App from "./App";
import fetchMock from "jest-fetch-mock";

describe("App", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  it("gets cost data", async () => {
    fetchMock.mockResponses(
      [JSON.stringify({}), { status: 200 }],
      [
        JSON.stringify([
          {
            key: "cloudforecast",
            value: {
              entityTag: "inventory-planner",
              generatedAt: "2024-11-18T14:35:00Z",
              dataFormatVersion: "v1.1",
              links: {
                mostRecentReportDeepLink:
                  "https://example.com/reports/funrepo/latest",
              },
              dailyMetrics: {
                mostRecentDay: {
                  cost: 120.55,
                  dayAsStr: "2024-11-18",
                },
                previousDay: {
                  cost: 110.75,
                  dayAsStr: "2024-11-17",
                },
                sevenDayAverage: 115.25,
                thirtyDayAverage: 112.8,
              },
              monthlyMetrics: {
                currentMonth: {
                  cost: 2340.0,
                  monthAsStr: "2024-11",
                },
                previousMonth: {
                  cost: 3100.5,
                  monthAsStr: "2024-10",
                },
                endOfMonthForecast: 3650.0,
                monthlyBudget: 4000.0,
              },
              recentAlerts: [
                {
                  report_date: "2024-11-17",
                  description: "Cost exceeded daily limit.",
                  whyDeepLink: "https://example.com/alerts/funrepo/why",
                  status: "stormy",
                },
              ],
            },
          },
        ]),
        { status: 200 },
      ]
    );
    const { queryByText } = render(<App />);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(queryByText("Cost exceeded daily limit.")).toBeInTheDocument();
    });
  });

  it("gets no cost data", async () => {
    fetchMock.mockResponses(
      [JSON.stringify({}), { status: 200 }],
      [
        JSON.stringify([
          {
            key: "cloudforecast",
          },
        ]),
        { status: 200 },
      ]
    );
    const { queryByText } = render(<App />);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(queryByText("Data not found")).toBeInTheDocument();
    });
  });

  it("gets invalid custom data", async () => {
    fetchMock.mockResponses(
      [JSON.stringify({}), { status: 200 }],
      [
        JSON.stringify([{ key: "cloudforecast", value: "invalid" }]),
        { status: 200 },
      ]
    );
    const { queryByText } = render(<App />);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(queryByText("Invalid data format")).toBeInTheDocument();
    });
  });
});
