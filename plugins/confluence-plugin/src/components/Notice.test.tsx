import { render, waitFor } from "@testing-library/react";
import Notice from "./Notice";

describe("Notice component", () => {
  it("renders children correctly", async () => {
    const { getByText } = render(<Notice>Test Notice</Notice>);
    await waitFor(() => {
      expect(getByText("Test Notice")).toBeInTheDocument();
    });
  });
});
