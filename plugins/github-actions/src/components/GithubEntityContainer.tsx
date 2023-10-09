import { Stack, Text } from "@cortexapps/plugin-core/components";
import { getGithubDetailsFromEntityYaml } from "../lib/parseEntity";
import GithubEntityProvider from "./GithubEntityProvider";
import { Router } from "./Router";

interface GithubEntityContainerProps {
  entityYaml?: Record<string, any>;
}

const GithubEntityContainer: React.FC<GithubEntityContainerProps> = ({
  entityYaml,
}) => {
  const { owner, repo } =
    getGithubDetailsFromEntityYaml(entityYaml ?? {}) ?? {};

  return !entityYaml || !owner || !repo ? (
    <Stack>
      <Text>
        No GitHub information found for this entity. GitHub information must be
        provided by the entity's YAML file.
      </Text>
    </Stack>
  ) : (
    <GithubEntityProvider owner={owner} repo={repo}>
      <Router />
    </GithubEntityProvider>
  );
};

export default GithubEntityContainer;
