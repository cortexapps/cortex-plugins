/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getReleases } from "../api/Github";
import { getGithubDetailsFromEntity } from "../lib/parseEntity";
import {
  Box,
  List,
  Loader,
  Stack,
  Text,
  Title,
  Toggle,
} from "@cortexapps/plugin-core/components";
import GitReleaseItem from "./GitReleaseItem";
import { isEmpty } from "lodash";

interface GitReleasesProps {
  entityYaml: Record<string, any>;
}

const compareCreationDate = (
  a: Record<string, any>,
  b: Record<string, any>
): number => {
  return a.created_at < b.created_at ? 1 : -1;
};

const perPage = 100;

const GitReleases: React.FC<GitReleasesProps> = ({ entityYaml }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [releases, setReleases] = useState<Array<Record<string, any>>>([]);
  const [showDrafts, setShowDrafts] = useState<boolean>(false);

  const { owner, repo } = getGithubDetailsFromEntity(entityYaml) as {
    owner: string;
    repo: string;
  };

  const fetchReleases = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);
      try {
        const releases = await getReleases(owner, repo, { page, perPage });

        if (releases.length === perPage) {
          void fetchReleases(page + 1);
        } else {
          setIsLoading(false);
        }

        if (page === 1) {
          setReleases(releases);
        } else {
          setReleases((prevReleases) => [...prevReleases, ...releases]);
        }
      } catch (e: any) {
        setError(e);
        setIsLoading(false);
      }
    },
    [owner, repo]
  );

  useEffect(() => {
    void fetchReleases();
  }, [fetchReleases]);

  const releasesToShow = useMemo(() => {
    if (showDrafts) {
      return releases.sort(compareCreationDate);
    }

    return releases
      .filter((release) => {
        return release.draft === false && release.prerelease === false;
      })
      .sort(compareCreationDate);
  }, [releases, showDrafts]);

  return (
    <div>
      <Title level={2} noMarginBottom>
        Releases
      </Title>
      {!isEmpty(releases) && (
        <Stack alignItems={"center"} row>
          <label htmlFor={"ToggleDrafts"}>Show drafts</label>
          <Toggle
            checked={showDrafts}
            onChange={() => {
              setShowDrafts((prev) => !prev);
            }}
            id={"ToggleDrafts"}
          />
        </Stack>
      )}
      {isLoading && <Loader />}
      {error && (
        <Box backgroundColor={"warning"} padding={2}>
          <Text bold>Error:</Text> {error.toString()}
        </Box>
      )}
      {isEmpty(releases) && !isLoading ? (
        <Box alignItems={"center"} padding={3} justifyContent={"center"}>
          <Text light>No releases found</Text>
        </Box>
      ) : (
        <List>
          {releasesToShow.map((release) => (
            <GitReleaseItem key={release.id} release={release} />
          ))}
        </List>
      )}
    </div>
  );
};

export default GitReleases;
