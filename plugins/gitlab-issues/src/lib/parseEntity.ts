export const getGitlabDetailsFromEntity = (
  entity: Record<string, any>
): { owner: string; repo: string; basepath: string } | undefined => {
  try {
    const gitlabDetails = entity.info["x-cortex-git"]?.gitlab;

    if (!gitlabDetails) {
      return undefined;
    }

    const [owner, repo] = gitlabDetails?.repository?.split("/");
    const basepath = gitlabDetails?.repository?.basepath;

    if (!owner || !repo) {
      return undefined;
    }

    return {
      basepath,
      owner,
      repo,
    };
  } catch (err: any) {
    console.error(`Error parsing GitLab details from entity descriptor:`, err);
  }
};
