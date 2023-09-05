import { render } from "@testing-library/react";
import Issues from "./Issues";

const gitJSON = [
  {
    project_id: 4,
    milestone: {
      due_date: null,
      project_id: 4,
      state: "closed",
      description:
        "Rerum est voluptatem provident consequuntur molestias similique ipsum dolor.",
      iid: 3,
      id: 11,
      title: "v3.0",
      created_at: "2016-01-04T15:31:39.788Z",
      updated_at: "2016-01-04T15:31:39.788Z",
    },
    author: {
      state: "active",
      web_url: "https://gitlab.example.com/root",
      avatar_url: null,
      username: "root",
      id: 1,
      name: "Administrator",
    },
    description: "Omnis vero earum sunt corporis dolor et placeat.",
    state: "closed",
    iid: 1,
    assignees: [
      {
        avatar_url: null,
        web_url: "https://gitlab.example.com/lennie",
        state: "active",
        username: "lennie",
        id: 9,
        name: "Dr. Luella Kovacek",
      },
    ],
    assignee: {
      avatar_url: null,
      web_url: "https://gitlab.example.com/lennie",
      state: "active",
      username: "lennie",
      id: 9,
      name: "Dr. Luella Kovacek",
    },
    type: "ISSUE",
    labels: ["foo", "bar"],
    upvotes: 4,
    downvotes: 0,
    merge_requests_count: 0,
    id: 41,
    title: "Ut commodi ullam eos dolores perferendis nihil sunt.",
    updated_at: "2016-01-04T15:31:46.176Z",
    created_at: "2016-01-04T15:31:46.176Z",
    closed_at: null,
    closed_by: null,
    user_notes_count: 1,
    due_date: null,
    web_url: "http://gitlab.example.com/my-group/my-project/issues/1",
    references: {
      short: "#1",
      relative: "my-project#1",
      full: "my-group/my-project#1",
    },
    time_stats: {
      time_estimate: 0,
      total_time_spent: 0,
      human_time_estimate: null,
      human_total_time_spent: null,
    },
    has_tasks: true,
    task_status: "10 of 15 tasks completed",
    confidential: false,
    discussion_locked: false,
    issue_type: "issue",
    severity: "UNKNOWN",
    _links: {
      self: "http://gitlab.example.com/api/v4/projects/4/issues/41",
      notes: "http://gitlab.example.com/api/v4/projects/4/issues/41/notes",
      award_emoji:
        "http://gitlab.example.com/api/v4/projects/4/issues/41/award_emoji",
      project: "http://gitlab.example.com/api/v4/projects/4",
      closed_as_duplicate_of:
        "http://gitlab.example.com/api/v4/projects/1/issues/75",
    },
    task_completion_status: {
      count: 0,
      completed_count: 0,
    },
  },
];

const serviceYaml = `
openapi: 3.0.1
info:
  title: PatientConnect
  x-cortex-git:
    gitlab:
      alias: main
      repository: cremerfc/patientconnect
  x-cortex-tag: patientconnect
  x-cortex-type: service
  x-cortex-groups:
  - plugin
  `;

describe("Issues", () => {
  beforeEach(() => {
    // if you have an existing `beforeEach` just add the following lines to it
    // fetchMock.mockIf(/^https?:\/\/api.getcortexapp.com*$/, req => {
    //     console.log("in block")
    //     return {
    //         body: JSON.stringify({}),
    //         headers: {
    //           'X-Some-Response-Header': 'Some header value'
    //         }
    //       }

    // })

    fetchMock.mockResponse(async (req) => {
      const targetUrl = req.url;
      if (targetUrl.startsWith("https://api.getcortexapp.com")) {
        return await Promise.resolve(JSON.stringify(serviceYaml));
      } else if (targetUrl.startsWith("https://gitlab.com/")) {
        return await Promise.resolve(JSON.stringify(gitJSON));
      }
      throw new Error("Unexpected path");
    });
  });

  it("has Issues", async () => {
    render(<Issues />);
  });
});
