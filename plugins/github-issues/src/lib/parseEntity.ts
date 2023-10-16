export const getGithubDetailsFromEntity = (
  entity: Record<string, any>
): { owner: string; repo: string; basepath: string } | undefined => {
  let owner = "";
  let repo = "";
  let basepath = "";

  try {
    const githubDetails = entity.info["x-cortex-git"]?.github;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!githubDetails) {
      owner = "";
      repo = "";
      basepath = "";

      return undefined;
    } else {
      [owner, repo] = githubDetails?.repository?.split("/");
      basepath = githubDetails?.repository?.basepath;
    }
    if (!owner || !repo) {
      owner = "";
      repo = "";
      basepath = "";
    }
  } catch {
    console.log(
      "There was an error getting the GitHub details. Check entity to see how the GitHub repo is configured"
    );
  }

  return { owner, repo, basepath };
};
