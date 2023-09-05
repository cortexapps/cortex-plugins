import { render } from "@testing-library/react";
import Images from "./Images";

const gitJSON = [
  {
    "id": 2,
    "name": "",
    "path": "group/project",
    "project_id": 9,
    "location": "gitlab.example.com:5000/group/project",
    "created_at": "2019-01-10T13:38:57.391Z",
    "cleanup_policy_started_at": "2020-08-17T03:12:35.489Z",
    "tags_count": 1,
    "tags": [
      {
        "name": "0.0.1",
        "path": "group/project:0.0.1",
        "location": "gitlab.example.com:5000/group/project:0.0.1"
      }
    ],
    "size": 2818413
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

describe("Images", () => {
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

  it("has Images", async () => {
    render(<Images />);
  });
});
