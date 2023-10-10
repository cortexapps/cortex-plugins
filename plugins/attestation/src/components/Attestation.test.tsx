import { render } from "@testing-library/react";
import Attestation from "./Attestation";

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
  describe("Attestation", () => {
    beforeEach(() => {
        fetchMock.mockResponse(async (req) => {
            const targetUrl = req.url;
            if (targetUrl.startsWith("https://api.getcortexapp.com")) {
              return await Promise.resolve(JSON.stringify(serviceYaml));
            } 
            throw new Error("Unexpected path");
          });
        });
      
        it("has Attestation", async () => {
          render(<Attestation />);
        });
      });