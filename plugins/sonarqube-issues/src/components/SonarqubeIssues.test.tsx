import { render, waitFor } from "@testing-library/react";
import SonarQubeIssues from "./SonarQubeIssues";

const issuesResp = {
  total: 3,
  p: 1,
  ps: 100,
  paging: {
    pageIndex: 1,
    pageSize: 100,
    total: 3,
  },
  effortTotal: 12,
  debtTotal: 12,
  issues: [
    {
      key: "AZGA0FU2K5CbPgAYf4Pr",
      rule: "typescript:S1854",
      severity: "MAJOR",
      component: "martindstone-org_funrepo:index.tsx",
      project: "martindstone-org_funrepo",
      line: 3,
      hash: "ad1e379169a24735d922555c92f04126",
      textRange: {
        startLine: 3,
        endLine: 3,
        startOffset: 10,
        endOffset: 22,
      },
      flows: [],
      status: "OPEN",
      message: 'Remove this useless assignment to variable "secretApiKey".',
      effort: "1min",
      debt: "1min",
      assignee: "martindstone@github",
      author: "martindstone@me.com",
      tags: ["cwe", "unused"],
      creationDate: "2024-08-23T21:54:55+0200",
      updateDate: "2024-08-26T21:21:44+0200",
      type: "CODE_SMELL",
      organization: "martindstone-org",
      cleanCodeAttribute: "LOGICAL",
      cleanCodeAttributeCategory: "INTENTIONAL",
      impacts: [
        {
          softwareQuality: "MAINTAINABILITY",
          severity: "MEDIUM",
        },
      ],
      issueStatus: "OPEN",
    },
    {
      key: "AZGA0FU2K5CbPgAYf4Ps",
      rule: "typescript:S1854",
      severity: "MAJOR",
      component: "martindstone-org_funrepo:index.tsx",
      project: "martindstone-org_funrepo",
      line: 6,
      hash: "c50e075544f8218bf672958c96e2b394",
      textRange: {
        startLine: 6,
        endLine: 6,
        startOffset: 10,
        endOffset: 24,
      },
      flows: [],
      status: "OPEN",
      message: 'Remove this useless assignment to variable "unusedVariable".',
      effort: "1min",
      debt: "1min",
      assignee: "martindstone@github",
      author: "martindstone@me.com",
      tags: ["cwe", "unused"],
      creationDate: "2024-08-23T21:54:55+0200",
      updateDate: "2024-08-26T17:11:19+0200",
      type: "CODE_SMELL",
      organization: "martindstone-org",
      cleanCodeAttribute: "LOGICAL",
      cleanCodeAttributeCategory: "INTENTIONAL",
      impacts: [
        {
          softwareQuality: "MAINTAINABILITY",
          severity: "MEDIUM",
        },
      ],
      issueStatus: "OPEN",
    },
    {
      key: "AZGA0FU2K5CbPgAYf4Pt",
      rule: "typescript:S1862",
      severity: "MAJOR",
      component: "martindstone-org_funrepo:index.tsx",
      project: "martindstone-org_funrepo",
      line: 21,
      hash: "1421bf36954c21103f4a1934e5b63fa4",
      textRange: {
        startLine: 21,
        endLine: 21,
        startOffset: 15,
        endOffset: 26,
      },
      flows: [
        {
          locations: [
            {
              component: "martindstone-org_funrepo:index.tsx",
              textRange: {
                startLine: 19,
                endLine: 19,
                startOffset: 8,
                endOffset: 19,
              },
              msg: "Covering",
            },
          ],
        },
      ],
      status: "OPEN",
      message: "This condition is covered by the one on line 19",
      effort: "10min",
      debt: "10min",
      assignee: "martindstone@github",
      author: "martindstone@me.com",
      tags: ["pitfall", "unused"],
      creationDate: "2024-08-23T21:54:55+0200",
      updateDate: "2024-08-24T03:12:29+0200",
      type: "BUG",
      organization: "martindstone-org",
      cleanCodeAttribute: "LOGICAL",
      cleanCodeAttributeCategory: "INTENTIONAL",
      impacts: [
        {
          softwareQuality: "RELIABILITY",
          severity: "MEDIUM",
        },
      ],
      issueStatus: "OPEN",
    },
  ],
  components: [
    {
      organization: "martindstone-org",
      key: "martindstone-org_funrepo:index.tsx",
      uuid: "AZGA0FJxK5CbPgAYf4Pq",
      enabled: true,
      qualifier: "FIL",
      name: "index.tsx",
      longName: "index.tsx",
      path: "index.tsx",
    },
  ],
  organizations: [
    {
      key: "martindstone-org",
      name: "martindstone-org",
    },
  ],
  facets: [],
};

const serviceYaml = {
  info: {
    "x-cortex-static-analysis": {
      sonarqube: {
        project: "martindstone-org_funrepo",
      },
    },
  },
};

describe("Issues", () => {
  it("has Issues", async () => {
    fetchMock.mockIf(
      /^https:\/\/sonarcloud\.io\/api\/issues/,
      async (_req: Request) => {
        return await Promise.resolve(JSON.stringify(issuesResp));
      }
    );

    const { queryByText, queryAllByText } = render(
      <SonarQubeIssues entityYaml={serviceYaml} />
    );
    await waitFor(() => {
      expect(queryByText("Loading")).not.toBeInTheDocument();
      const majorElements = queryAllByText("major");
      expect(majorElements.length).toEqual(3);
      const commentElements = queryAllByText("Comment");
      expect(commentElements.length).toBeGreaterThan(0);
    });
  });

  it("has no Issues", async () => {
    fetchMock.mockIf(
      /^https:\/\/sonarcloud\.io\/api\/issues/,
      async (_req: Request) => {
        return await Promise.resolve(JSON.stringify({ issues: [] }));
      }
    );
    const { queryByText } = render(
      <SonarQubeIssues entityYaml={serviceYaml} />
    );

    await waitFor(() => {
      expect(queryByText("Loading")).not.toBeInTheDocument();
      expect(
        queryByText(/We could not find any Sonarqube issues/)
      ).toBeInTheDocument();
    });
  });
});
