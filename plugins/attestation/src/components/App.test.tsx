import { render } from "@testing-library/react";
import App from "./App";

fetchMock.mockIf(
  // ${cortexUrl}/catalog/${cortexTag}/custom-data/checklist
  /^https:\/\/api\.getcortexapp\.com\/catalog\/*\/custom-data\/checklist\//,
  async (_req: Request) => {
    return await Promise.resolve(JSON.stringify({}));
  }
);

fetchMock.mockIf(
  // ${cortexUrl}/catalog/${cortexTag}/custom-data
  /^https:\/\/api\.getcortexapp\.com\/catalog\/*\/custom-data\/.*/,
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
      "https://api.cortex.dev/catalog/inventory-planner/custom-data/checklist"
    );
  });
});
