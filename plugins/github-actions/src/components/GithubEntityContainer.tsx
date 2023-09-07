import { getGithubDetailsFromEntityYaml } from "../lib/parseEntity";
import { Stack, Text } from "@cortexapps/plugin-core/components";
import GithubEntityProvider from "./GithubEntityProvider";
import { Router } from "./Router";

interface GithubEntityContainerProps {
  entityYaml?: Record<string, any>;
}

const GithubEntityContainer: React.FC<GithubEntityContainerProps> = ({
  entityYaml,
}) => {
  if (!entityYaml) {
    return (
      <Stack>
        <Text>
          No GitHub information found for this entity. GitHub information must
          be provided by the entity's YAML file.
        </Text>
      </Stack>
    );
  }

  const { owner, repo } = getGithubDetailsFromEntityYaml(entityYaml) ?? {};

  return !owner || !repo ? (
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
