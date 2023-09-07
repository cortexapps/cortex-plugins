import { createContext } from "react";

interface IGithubEntityContext {
  owner: string;
  repo: string;
}

export const GithubEntityContext = createContext<IGithubEntityContext>({
  owner: "",
  repo: "",
});

const GithubEntityProvider: React.FC<
  React.PropsWithChildren<IGithubEntityContext>
> = ({ children, owner, repo }) => {
  return (
    <GithubEntityContext.Provider value={{ owner, repo }}>
      {children}
    </GithubEntityContext.Provider>
  );
};

export default GithubEntityProvider;
