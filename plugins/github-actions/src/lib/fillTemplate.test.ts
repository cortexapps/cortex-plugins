import fillTemplate from "./fillTemplate";

describe("fillTemplate", () => {
  it("should fill template", () => {
    const templateString =
      "https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}/comments";
    const templateVars = {
      owner: "octocat",
      repo: "hello-world",
      issue_number: 123,
    };

    expect(fillTemplate(templateString, templateVars)).toEqual(
      "https://api.github.com/repos/octocat/hello-world/issues/123/comments"
    );
  });
});
