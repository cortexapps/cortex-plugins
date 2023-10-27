export const getGithubDetailsFromEntity = (
  entity: Record<string, any>
): { owner: string; repo: string; basepath: string } | undefined => {

  try {
    const githubDetails = entity.info["x-cortex-git"]?.github;
    if (!githubDetails) {
      return undefined;
    } 
    const [owner, repo] = githubDetails?.repository?.split("/");
    const basepath = githubDetails?.repository?.basepath;
    
    if (!owner || !repo) {
      return undefined;
    }
    return {
      basepath,
      owner,
      repo,
    };
  } catch(err: any) { 
    console.log(
      `Error parsing GitLab details from entity descriptor:`, err
    );
  }  
};
