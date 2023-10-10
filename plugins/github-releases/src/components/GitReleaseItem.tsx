/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { ListItem, Stack, Text } from "@cortexapps/plugin-core/components";
import type React from "react";

interface GitReleaseItemProps {
  release: Record<string, any>;
}

const GitReleaseItem: React.FC<GitReleaseItemProps> = ({ release }) => {
  return (
    <ListItem flex>
      <Stack>
        <Text bold>{release.name}</Text>
        <Stack row>
          <Stack>
            <Text light>Created at</Text>
            <Text>{new Date(release.created_at).toLocaleString()}</Text>
          </Stack>
          <Stack>
            <Text light>Author</Text>
            <Text>{release.author.login}</Text>
          </Stack>
          <Stack>
            <Text light>Released at</Text>
            <Text>
              {release.published_at
                ? new Date(release.published_at).toLocaleString()
                : ""}
            </Text>
          </Stack>
        </Stack>
        <Stack>
          {/* purposely include "empty" <Text> for alignment */}
          <Text light> </Text>
          <Text>{release.body}</Text>
        </Stack>
      </Stack>
    </ListItem>
  );
};

export default GitReleaseItem;
