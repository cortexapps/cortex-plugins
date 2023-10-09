import { render } from "@testing-library/react";
import App from "./App";

fetchMock.mockIf(
  /^https:\/\/dev80317\.service-now\.com\/api\/now\/table\/cmdb_ci_service\/ .*/,
  async (_req: Request) => {
    return await Promise.resolve(JSON.stringify({}));
  }
);

fetchMock.mockIf(
  /^https:\/\/dev80317\.service-now\.com\/api\/now\/table\/incident\/.*/,
  async (_req: Request) => {
    return await Promise.resolve(
      JSON.stringify({
        info: {},
      })
    );
  }
);

describe("App", () => {
  it("indicates that it's an awesome plugin", () => {
    render(<App />);

    expect(fetch).toHaveBeenCalledWith(
      "https://dev80317.service-now.com/api/now/table/cmdb_ci_service?sysparm_query=name%3DInventory%20planner"
    );
  });
});
