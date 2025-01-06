import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PageSelector from "./PageSelector";

const mockPages = [
  { id: 1, title: "Page One" },
  { id: 2, title: "Page Two" },
  { id: 3, title: "" },
];

describe("PageSelector Component", () => {
  it("renders without crashing", () => {
    render(
      <PageSelector
        currentPageId={1}
        onChangeHandler={jest.fn()}
        pages={mockPages}
        disabled={false}
      />
    );
  });

  it("displays the correct number of options", async () => {
    render(
      <PageSelector
        currentPageId={1}
        onChangeHandler={jest.fn()}
        pages={mockPages}
        disabled={false}
      />
    );

    const options = screen.getAllByRole("option");
    await waitFor(() => {
      expect(options).toHaveLength(mockPages.length);
    });
  });

  it("displays the correct option text", async () => {
    render(
      <PageSelector
        currentPageId={1}
        onChangeHandler={jest.fn()}
        pages={mockPages}
        disabled={false}
      />
    );
    await waitFor(() => {
      expect(screen.getByText("Page One")).toBeInTheDocument();
      expect(screen.getByText("Page Two")).toBeInTheDocument();
      expect(screen.getByText("Confluence Page 3")).toBeInTheDocument();
    });
  });

  it("calls onChangeHandler with the correct arguments", async () => {
    const mockOnChangeHandler = jest.fn();
    render(
      <PageSelector
        currentPageId={1}
        onChangeHandler={mockOnChangeHandler}
        pages={mockPages}
        disabled={false}
      />
    );

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "2" } });
    await waitFor(() => {
      expect(mockOnChangeHandler).toHaveBeenCalledWith("2");
    });
  });

  it("is disabled when the disabled prop is true", async () => {
    render(
      <PageSelector
        currentPageId={1}
        onChangeHandler={jest.fn()}
        pages={mockPages}
        disabled={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeDisabled();
    });
  });

  it("is not disabled when the disabled prop is false", async () => {
    render(
      <PageSelector
        currentPageId={1}
        onChangeHandler={jest.fn()}
        pages={mockPages}
        disabled={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("combobox")).not.toBeDisabled();
    });
  });
});
