/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import Select from "react-select";
import { CortexApi, PluginContextLocation } from "@cortexapps/plugin-core";
import {
  SimpleTable,
  Box,
  Text,
  Loader,
  usePluginContext,
  Input,
  Button,
} from "@cortexapps/plugin-core/components";
import "../baseStyles.css";

const Attestation: React.FC = () => {
  const context = usePluginContext();
  const cortexTag = context.entity!.tag;
  const cortexUrl = context.apiBaseUrl;
  const currentUser = context.user.name;

  const entityType = context.entity?.type;

  const [posts, setPosts] = React.useState<any[]>([]);
  const [hasList, setHasList] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  // The following variables are for the value of the questions.
  // Add/Edit/Delete these to match your questions
  const [secureEnv, setSecureEnv] = React.useState("");
  const [trustedSource, setTrustedSource] = React.useState("");
  const [provenanceData, setProvenanceData] = React.useState("");
  const [secVuln, setSecVuln] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(
    context.location === PluginContextLocation.Entity
  );

  React.useEffect(() => {
    if (context.location === PluginContextLocation.Entity) {
      // Code to see if there are any previous Attestations.
      const fetchData = async (): Promise<void> => {
        // Let's see if there is any previous checklist data
        try {
          const gUrl = `${cortexUrl}/catalog/${cortexTag}/custom-data/checklist`;
          const result = await fetch(gUrl);
          if (result.ok) {
            const resultJson = await result.json();
            setPosts(resultJson.value);
            setHasList(true);
          }
        } catch (error) {}
        setIsLoading(false);
      };

      void fetchData();
    }
  }, []);

  const checkHandler = () => {
    setIsChecked(!isChecked);
  };
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const secureEnvHandler = (secureEnv) => {
    setSecureEnv(secureEnv.value);
  };
  const trustedSourceHandler = (trustedSource) => {
    setTrustedSource(trustedSource.value);
  };
  const provenanceDataHandler = (provenanceData) => {
    setProvenanceData(provenanceData.value);
  };
  const secVulnHandler = (secVuln) => {
    setSecVuln(secVuln.value);
  };
  // const handleSubmit = async (e) => {
  // e.preventDefault();

  const postData = async () => {
    const cdUrl = `${cortexUrl}/catalog/${cortexTag}/custom-data`;
    try {
      const postRestult = CortexApi.proxyFetch(cdUrl, {
        method: "POST",
        body: JSON.stringify({
          key: "checklist",
          value: [
            {
              date: Date(),
              signed_by: currentUser,
              secureEnv,
              trustedSource,
              provenanceData,
              secVuln,
            },
          ],
        }),
      });
      if ((await postRestult).ok){
        alert("Successfully updated");
        window.location.reload();
      }
      else
      {
        alert("There was an issue saving the data. Check the Console Log")
      }
    } catch (error) {   }
  };

  const options = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
    { value: `N/A`, label: `N/A` },
  ];
  const config = {
    columns: [
      {
        Cell: (date: string) => (
          <Box>
            <Text>{date}</Text>
          </Box>
        ),
        accessor: "date",
        id: "date",
        title: "Date",
        width: "25%",
      },
      {
        Cell: (signedBy: string) => (
          <Box>
            <Text>{signedBy}</Text>
          </Box>
        ),
        accessor: "signed_by",
        id: "signed_by",
        title: "Signed By",
        width: "35%",
      },
      {
        Cell: (secureEnv: string) => (
          <Box>
            <Text>{secureEnv}</Text>
          </Box>
        ),
        accessor: "secureEnv",
        id: "secureEnv",
        title: "Secure environments",
        width: "35%",
      },
      {
        Cell: (trustedSource: string) => (
          <Box>
            <Text>{trustedSource}</Text>
          </Box>
        ),
        accessor: "trustedSource",
        id: "trustedSource",
        title: "Trusted Supply Chains",
        width: "35%",
      },
      {
        Cell: (provenanceData: string) => (
          <Box>
            <Text>{provenanceData}</Text>
          </Box>
        ),
        accessor: "provenanceData",
        id: "provenanceData",
        title: "Maintains Provenance Data",
        width: "35%",
      },
      {
        Cell: (provenanceData: string) => (
          <Box>
            <Text>{provenanceData}</Text>
          </Box>
        ),
        accessor: "secVuln",
        id: "secVuln",
        title: "Automated Vulnerability Tool",
        width: "35%",
      },
    ],
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div>
      {hasList ? (
        <div>
          <h2>Attestation for this {entityType}</h2>
          <SimpleTable config={config} items={posts} />
        </div>
      ) : (
        <Box backgroundColor="light" padding={3} borderRadius={2}>
          <Text>No Attestations has been submitted to this service</Text>
        </Box>
      )}
      <br />
      <br />

      {
        <div>
          <Input
            type="checkbox"
            id="checkbox"
            checked={isChecked}
            onChange={checkHandler}
          />
          <label htmlFor="checkbox">&ensp; Submit New Attestation </label>
          <br />
          <br />
          <br />
        </div>
      }

      {isChecked && (
        <div>
          <Text>
            The software was developed and built in secure environments.
          </Text>
          <br />
          <div style={{ width: "100px" }}>
            <Select
              id="secure-env-select"
              options={options}
              onChange={secureEnvHandler}
            />
          </div>
          <br />
          <Text>
            The software producer has made a good-faith effort to maintain
            trusted source code supply chains
          </Text>
          <br />
          <div style={{ width: "100px" }}>
            <Select
              id="trusted-source-select"
              options={options}
              onChange={trustedSourceHandler}
            />
          </div>
          <br />
          <Text>
            The software producer maintains provenance data for internal and
            third-party code incorporated into the software
          </Text>
          <br />
          <div style={{ width: "100px" }}>
            <Select
              id="provenance-data-select"
              options={options}
              onChange={provenanceDataHandler}
            />
          </div>
          <br />
          <Text>
            The software producer employed automated tools or comparable
            processes that check for security vulnerabilities
          </Text>
          <br />
          <div style={{ width: "100px" }}>
            <Select
              id="sec-vuln-select"
              options={options}
              onChange={secVulnHandler}
            />
          </div>
          <br />
          <br />
          <Text>
            {" "}
            By clicking on the button below, I {currentUser} attest that the
            referenced software has been verified by a certified FedRAMP Third
            Party Assessor Organization (3PAO) or other 3PAO approved by an
            appropriate agency official, and the Assessor used relevant NIST
            Guidance, which includes all elements outlined in this form, as the
            assessment baseline. Relevant documentation is attache
          </Text>
          <br />
          <br />

          <Button
            type="submit"
            onClick={() => {
              postData();
            }}
          >
            Submit Attestation
          </Button>
        </div>
      )}
    </div>
  );
};

export default Attestation;
