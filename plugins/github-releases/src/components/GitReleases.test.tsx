import { act, render, screen, waitFor } from "@testing-library/react";
import GitReleases from "./GitReleases";

const entityYamlWithGitInfo = {
  info: {
    "x-cortex-git": {
      github: {
        repository: "cortexapps/plugin-core",
      },
    },
  },
};

const mockRelease = {
  id: 1,
  name: "Release 1",
  created_at: "2021-08-05T15:00:00Z",
  published_at: "2021-08-05T15:00:00Z",
  body: "Feature 1\nFeature 2",
  draft: false,
  author: {
    login: "githubdev224",
  },
  prerelease: false,
};

const mockDraftRelease = {
  ...mockRelease,
  id: 2,
  name: "Draft 1",
  draft: true,
};

const mockPrereleaseRelease = {
  ...mockRelease,
  id: 3,
  name: "Prerelease 1",
  prerelease: true,
};

fetchMock.mockIf(
  /^https:\/\/api\.github\.com\/repos\/cortexapps\/plugin-core\/releases*/,
  async (_req: Request) => {
    return await Promise.resolve(JSON.stringify([]));
  }
);

describe("GitReleases", () => {
  it("renders with git info but no releases", async () => {
    render(<GitReleases entityYaml={entityYamlWithGitInfo} />);

    expect(screen.queryByText("No releases found")).not.toBeInTheDocument();
    expect(screen.queryByText("Loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });

    expect(screen.queryByText("No releases found")).toBeInTheDocument();
  });

  it("renders with git info and releases", async () => {
    fetchMock.mockIf(
      /^https:\/\/api\.github\.com\/repos\/cortexapps\/plugin-core\/releases*/,
      async (_req: Request) => {
        return await Promise.resolve(JSON.stringify([mockRelease]));
      }
    );

    render(<GitReleases entityYaml={entityYamlWithGitInfo} />);

    expect(screen.queryByText("No releases found")).not.toBeInTheDocument();
    expect(screen.queryByText("Loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });

    expect(screen.queryByText("No releases found")).not.toBeInTheDocument();

    expect(screen.queryAllByText("Release 1")).toHaveLength(1);
  });

  it("does not show drafts or prereleases by default", async () => {
    fetchMock.mockIf(
      /^https:\/\/api\.github\.com\/repos\/cortexapps\/plugin-core\/releases*/,
      async (_req: Request) => {
        return await Promise.resolve(
          JSON.stringify([mockRelease, mockDraftRelease, mockPrereleaseRelease])
        );
      }
    );

    render(<GitReleases entityYaml={entityYamlWithGitInfo} />);

    expect(screen.queryByText("No releases found")).not.toBeInTheDocument();
    expect(screen.queryByText("Loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });

    expect(screen.queryByText("No releases found")).not.toBeInTheDocument();
    expect(screen.queryAllByText("Release 1")).toHaveLength(1);
  });

  it("allows toggling drafts", async () => {
    fetchMock.mockIf(
      /^https:\/\/api\.github\.com\/repos\/cortexapps\/plugin-core\/releases*/,
      async (_req: Request) => {
        return await Promise.resolve(
          JSON.stringify([mockRelease, mockDraftRelease, mockPrereleaseRelease])
        );
      }
    );

    render(<GitReleases entityYaml={entityYamlWithGitInfo} />);

    expect(screen.queryByText("No releases found")).not.toBeInTheDocument();
    expect(screen.queryByText("Loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });

    expect(screen.queryByText("No releases found")).not.toBeInTheDocument();
    expect(screen.queryAllByText("Release 1")).toHaveLength(1);

    expect(screen.queryByText("Show drafts")).toBeInTheDocument();

    await act(async () => {
      screen.getByText("Show drafts").click();
    });

    expect(screen.queryAllByText("Release 1")).toHaveLength(1);
    expect(screen.queryAllByText("Draft 1")).toHaveLength(1);
  });
});
