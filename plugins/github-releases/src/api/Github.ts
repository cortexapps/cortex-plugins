export const getReleases = async (
  owner: string,
  repo: string,
  { perPage = 100, page = 1 }
): Promise<any> => {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases?per_page=${perPage}&page=${page}`
  );
  if (res.status >= 400 && res.status < 600) {
    throw new Error(`Bad response from server: ${await res.text()}`);
  }
  return await res.json();
};
