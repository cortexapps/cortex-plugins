import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Stage from "./Stage";

describe("Stage", () => {
  it("renders fairly blank if there is no git info for the entity", async () => {
    render(<Stage />);
  });
});
