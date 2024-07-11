import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("indicates that it's an awesome plugin", () => {
    render(<App />);

    expect(screen.queryByText(/My Awesome Cortex Plugin/)).toBeInTheDocument();
  });
});
