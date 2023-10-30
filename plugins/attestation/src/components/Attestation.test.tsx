import { render, screen, waitFor } from "@testing-library/react";
import Attestation from "./Attestation";


const mockCustomData = {
  id:603014,
  key:"checklist",
  value:
  [
    {
      date:"Fri Oct 27 2023 10:34:33 GMT-0400 (Eastern Daylight Time)",
      secVuln:"Yes",
      secureEnv:"No",
      signed_by:"Francisco Cremer",
      trustedSource:"Yes",
      provenanceData:"Yes"
    }
    ],
    source:"API",
    dateUpdated:"2023-10-27T14:34:35.35304",
    description:null
  };

  describe("Attestation", () => {
    it("has previous attestation", async () => {
      fetchMock.mockIf(
        /^https:\/\/api\.getcortexapp\.com\/api\/v1\/catalog\/inventory-planner\/custom-data\/checklist\//,
        async (_req: Request) => {
          return await Promise.resolve(JSON.stringify(mockCustomData));
        }
      );
  
      render(<Attestation />);
      expect(screen.queryByText("Loading")).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.queryByText("Loading")).not.toBeInTheDocument();
      });
      screen.debug();
      expect(screen.queryByText("Attestation for this")).toBeInTheDocument();
    });
      });