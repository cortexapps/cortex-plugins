import { render } from "@testing-library/react";
import App from "./App";





describe("App", () => {
  it("indicates that it's an awesome plugin", () => {
    render(<App />);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.getcortexapp.com/api/v1/catalog/inventory-planner/custom-data/checklist"
    );
  });
});
