import { Octokit } from "octokit";

const octokit = new Octokit();

export const getReleases = async (
  owner: string,
  repo: string,
  { perPage = 100, page = 1 }
): Promise<any> => {
  const releases = await octokit.rest.repos.listReleases({
    owner,
    repo,
    query: {
      per_page: perPage,
      page,
    },
  });

  if (typeof releases.data === "string") {
    return JSON.parse(releases.data);
  }

  return releases.data;
};
