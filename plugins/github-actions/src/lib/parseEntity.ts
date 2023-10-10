export const getGithubDetailsFromEntityYaml = (
  entity: Record<string, any>
): { owner: string; repo: string } | undefined => {
  const githubDetails = entity?.info?.["x-cortex-git"]?.github;

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!githubDetails) {
    return undefined;
  }

  const [owner, repo] = githubDetails?.repository?.split("/");

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!owner || !repo) {
    return undefined;
  }

  return { owner, repo };
};
