import React from "react";
import { CortexApi, PluginContextLocation } from "@cortexapps/plugin-core";
import {
  SimpleTable,
  Box,
  Text,
  Loader,
  usePluginContext,
  Button,
} from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import configData = require("../assets/config.json");

// let globalResult = [];

const forceReloadDecorator = (): void => {
  window.location.reload();
};

const nonCortexPOST = (url: string, callBody: string): void => {
  void fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: callBody,
  });
};

let accountIDAvailable = false;

const Stage: React.FC = () => {
  const context = usePluginContext();
  const [posts, setPosts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(
    context.location === PluginContextLocation.Entity
  );
  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      let anyRunning = false;

      const accountIdentifier: string = configData.ACCOUNT_IDENTIFIER;
      if (accountIdentifier !== null && accountIdentifier !== "xxxx") {
        accountIDAvailable = true;
        // buttonsEnabled = true;
      }

      const harnessURL = `https://app.harness.io`;
      try {
        const orgRequest = await CortexApi.proxyFetch(`${harnessURL}/v1/orgs?`);
        const orgResult = await orgRequest.json();

        const totalExecutions: object[] = [];
        let iOrg;

        for (iOrg in orgResult) {
          const orgIdentifier: string = orgResult[iOrg].org.identifier;
          if (!orgIdentifier) {
            continue;
          }

          const projectRequest = await CortexApi.proxyFetch(
            `${harnessURL}/v1/orgs/default/projects?`
          );

          const projectResult = await projectRequest.json();

          let iProj;

          for (iProj in projectResult) {
            const projectIdentifier: string =
              projectResult[iProj].project.identifier;

            if (!projectIdentifier) {
              continue;
            }

            const pipelineRequest = await CortexApi.proxyFetch(
              `${harnessURL}/v1/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines?`
            );

            const pipelineResult = await pipelineRequest.json();

            let a;

            let index = 1;

            for (a in pipelineResult) {
              let pipelineFetchInputYamlResult;

              if (accountIDAvailable) {
                const pipelineResultIdentifier: string =
                  pipelineResult[a].identifier;
                if (!pipelineResultIdentifier) {
                  continue;
                }
                const pipelineInputSetRequest = await CortexApi.proxyFetch(
                  `${harnessURL}/pipeline/api/inputSets?pageIndex=0&pageSize=100&accountIdentifier=${accountIdentifier}&orgIdentifier=${orgIdentifier}&projectIdentifier=${projectIdentifier}&pipelineIdentifier=${pipelineResultIdentifier}`
                );

                const pipelineInputSetResult =
                  await pipelineInputSetRequest.json();

                let c;
                let pipelineInputSet: string;
                for (c in pipelineInputSetResult.data.content) {
                  pipelineInputSet =
                    pipelineInputSetResult.data.content[c].name;
                }

                if (!pipelineInputSet) {
                  continue;
                }

                const pipelineFetchInputYamlRequest =
                  await CortexApi.proxyFetch(
                    `${harnessURL}/pipeline/api/inputSets/${pipelineInputSet}?accountIdentifier=${accountIdentifier}&orgIdentifier=${orgIdentifier}&projectIdentifier=${projectIdentifier}&pipelineIdentifier=${pipelineResultIdentifier}`
                  );

                pipelineFetchInputYamlResult =
                  await pipelineFetchInputYamlRequest.json();
              }

              let b;
              for (b in pipelineResult[a].recent_execution_info) {
                const isRunning =
                  pipelineResult[a].recent_execution_info[
                    b
                  ].execution_status.toLowerCase() === "running";

                if (isRunning) {
                  anyRunning = true;
                }

                const thisPipeline = {
                  rerun: {
                    status: "",
                    url: "",
                    body: "",
                    available: accountIDAvailable,
                    running: isRunning,
                  },
                  no: index++,
                  name: {
                    pipelineID: pipelineResult[a].identifier,
                    pipelineName: pipelineResult[a].name,
                    runID:
                      pipelineResult[a].recent_execution_info[b].execution_id,
                  },
                  status: "",
                  details: "",
                  time: {
                    start: new Date(),
                    end: new Date(),
                    available: !isRunning,
                  },
                };

                thisPipeline.status =
                  pipelineResult[a].recent_execution_info[b].execution_status;
                const pipelineResultIdentifier: string =
                  pipelineResult[a].identifier;
                if (!pipelineResultIdentifier) {
                  continue;
                }
                if (accountIDAvailable) {
                  const inputURL = `${harnessURL}/pipeline/api/pipeline/execute/${pipelineResultIdentifier}/inputSetList?accountIdentifier=${accountIdentifier}&orgIdentifier=${orgIdentifier}&projectIdentifier=${projectIdentifier}`;
                  const inputBody = JSON.stringify({
                    inputSetReferences: [pipelineInputSet],
                    withMergedPipelineYaml: true,
                    stageIdentifiers: ["string"],
                    lastYamlToMerge:
                      pipelineFetchInputYamlResult.data.inputSetYaml,
                  });

                  thisPipeline.rerun = {
                    status: thisPipeline.status,
                    url: inputURL,
                    body: inputBody,
                    available: accountIDAvailable,
                    running: isRunning,
                  };
                }

                thisPipeline.time.start = new Date(
                  pipelineResult[a].recent_execution_info[b].started
                );
                thisPipeline.time.end = new Date(
                  pipelineResult[a].recent_execution_info[b].ended
                );
                totalExecutions.push(thisPipeline);
              }
            }
          }
        }

        setPosts(totalExecutions);
      } catch (error) {
        // alert(error.message);
      }

      setIsLoading(false);

      if (anyRunning) {
        setTimeout(function () {
          forceReloadDecorator();
        }, 30000);
      }
    };
    void fetchData();
  }, []);

  const config = {
    columns: [
      {
        Cell: (identifier: number) => (
          <Box>
            <Text bold={true}>{identifier}</Text>
          </Box>
        ),
        accessor: "no",
        id: "no",
        title: "NO",
      },
      {
        Cell: (name: { pipelineName: string; runID: number }) => (
          <Box>
            <Text legacyColor="primary" bold={true}>
              {name.pipelineName}
            </Text>
            <Text size={3} light={true}>
              Run ID: {name.runID}
            </Text>
          </Box>
        ),
        accessor: "name",
        id: "name",
        title: "PIPELINE NAME",
      },
      {
        Cell: (status: string) => (
          <Box>
            <Text
              legacyColor={
                status.toLowerCase() === "success"
                  ? "success"
                  : status.toLowerCase() === "running"
                  ? "blue"
                  : "danger"
              }
            >
              {status}
            </Text>
          </Box>
        ),
        accessor: "status",
        id: "status",
        title: "PIPELINE STATUS",
      },
      {
        Cell: (time: { start: Date; end: Date; available: boolean }) => (
          <Box>
            <Text light={true}>
              {time.available ? time.end.toLocaleString() : ""}
            </Text>
            <Text size={3} light={true}>
              {timeConversion(
                new Date().valueOf() - time.end.valueOf(),
                false,
                "run ",
                " ago"
              )}
            </Text>
            <Text size={3} light={true}>
              {timeConversion(
                time.end.valueOf() - time.start.valueOf(),
                true,
                "took "
              )}
            </Text>
          </Box>
        ),
        accessor: "time",
        id: "status",
        title: "PIPELINE TIME",
      },
      {
        Cell: (rerun: {
          status: string;
          url: string;
          body: string;
          available: boolean;
          running: boolean;
        }) => (
          <Box>
            <Button
              onClick={(e) => {
                if (rerun.available) {
                  nonCortexPOST(rerun.url, rerun.body);

                  setTimeout(function () {
                    forceReloadDecorator();
                  }, 5000);

                  e.currentTarget.disabled = true;
                  e.currentTarget.innerHTML = "starting...";
                } else {
                  alert("Please add your account ID to the config.json");
                }
              }}
              color={"primary"}
              disabled={!rerun.available || rerun.running}
              loading={rerun.status.toLowerCase() === "running"}
            >
              {" "}
              {rerun.running
                ? "in progress"
                : rerun.available
                ? "rerun"
                : "account id missing"}
            </Button>
          </Box>
        ),
        accessor: "rerun",
        id: "rerun",
        title: "RUN PIPELINE",
      },
    ],
  };

  // return <Text>{JSON.stringify(posts)}</Text>;

  return isLoading ? <Loader /> : <SimpleTable config={config} items={posts} />;

  function timeConversion(
    duration: number,
    useSeconds: boolean = true,
    prefix: string = "",
    postfix: string = ""
  ): null {
    if (duration <= 0) {
      return "";
    }

    const portions: string[] = [];

    const msInDays = 24 * 1000 * 60 * 60;
    const days = Math.trunc(duration / msInDays);
    if (days > 0) {
      if (days > 1000) {
        return "";
      }
      portions.push(`${days}d`);
      duration = duration - days * msInDays;
    }

    const msInHour = 1000 * 60 * 60;
    const hours = Math.trunc(duration / msInHour);
    if (hours > 0) {
      portions.push(`${hours}h`);
      duration = duration - hours * msInHour;
    }

    const msInMinute = 1000 * 60;
    const minutes = Math.trunc(duration / msInMinute);
    if (minutes > 0) {
      portions.push(`${minutes}m`);
      duration = duration - minutes * msInMinute;
    }
    if (useSeconds) {
      const seconds = Math.trunc(duration / 1000);
      if (seconds >= 0) {
        portions.push(`${seconds}s`);
      }
    }

    if (portions.length === 0) {
      return prefix + " just now";
    }

    return prefix + portions.join(" ") + postfix;
  }
};

export default Stage;
