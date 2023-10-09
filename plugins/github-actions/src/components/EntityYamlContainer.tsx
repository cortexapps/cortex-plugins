import {
  Stack,
  Text,
  usePluginContext,
} from "@cortexapps/plugin-core/components";
import EntityYamlProvider, { EntityYamlContext } from "./EntityYamlProvider";
import GithubEntityContainer from "./GithubEntityContainer";

const EntityYamlContainer: React.FC = () => {
  const context = usePluginContext();

  return !context?.entity ? (
    <Stack>
      <Text>
        Invalid context for GitHub Actions -- requires an entity context, but
        found
      </Text>
      <pre>{JSON.stringify(context, undefined, 2)}</pre>
    </Stack>
  ) : (
    <EntityYamlProvider entity={context.entity}>
      <EntityYamlContext.Consumer>
        {({ entityYaml }) => {
          return <GithubEntityContainer entityYaml={entityYaml} />;
        }}
      </EntityYamlContext.Consumer>
    </EntityYamlProvider>
  );
};

export default EntityYamlContainer;
