export const getGithubDetailsFromEntity = (
  entity: Record<string, any>
): { owner: string; repo: string; basepath: string } | undefined => {
  let owner = ""
  let repo = ""
  let basepath = ""

  
  try {
    const githubDetails = entity.info["x-cortex-git"]?.github;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!githubDetails) {
    owner = "";
    repo = "";
    basepath = "";

    return undefined;
  }
  else{
    [owner, repo] = githubDetails?.repository?.split("/");
    basepath = githubDetails?.repository?.basepath;
  }
  if (!owner || !repo) {
    owner = "";
    repo = "";
    basepath = "";
  } 

  }
  catch {console.log("caught an error")}
  

  

//  const [owner, repo] = githubDetails?.repository?.split("/");
//  const basepath = githubDetails?.repository?.basepath;

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  

  return { owner, repo, basepath };
};
