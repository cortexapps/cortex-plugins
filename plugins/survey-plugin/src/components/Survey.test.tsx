import { render } from "@testing-library/react";
import Survey from "./Survey";

const cdJSON = {"id":603014,"key":"checklist","value":[{"date":"Fri Oct 06 2023 13:29:10 GMT-0400 (Eastern Daylight Time)","secVuln":"No","secureEnv":"Yes","signed_by":"Fernando Cremer","trustedSource":"Yes","provenanceData":"Yes"}],"source":"API","dateUpdated":"2023-10-06T17:29:12.269689","description":null};
  describe("Survey", () => {
    beforeEach(() => {
        fetchMock.mockResponse(async (req) => {
            const targetUrl = req.url;
            if (targetUrl.startsWith("https://api.cortex.dev")) {
              return await Promise.resolve(JSON.stringify(cdJSON));
            } 
            throw new Error("Unexpected path");
          });
        });
      
        it("has Survey", async () => {
          render(<Survey />);
        });
      });