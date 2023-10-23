export const getGitLabDetailsFromEntity = (
  entity: Record<string, any>
): { owner: string; repo: string; basepath: string } | undefined => {
  let owner = "";
  let repo = "";
  let basepath = "";

  try {
    const gitlabDetails = entity.info["x-cortex-git"]?.gitlab;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!gitlabDetails) {
      owner = "";
      repo = "";
      basepath = "";

      return undefined;
    } else {
      [owner, repo] = gitlabDetails?.repository?.split("/");
      basepath = gitlabDetails?.repository?.basepath;
    }
    if (!owner || !repo) {
      owner = "";
      repo = "";
      basepath = "";
    }
  } catch {}

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return { owner, repo, basepath };
};
