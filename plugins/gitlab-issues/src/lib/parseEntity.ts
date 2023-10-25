export const getGitlabDetailsFromEntity = (
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
  } catch (err: any) {
    console.log(`Error parsing GitLab details from entity descriptor:`, err);
  }

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return { owner, repo, basepath };
};
