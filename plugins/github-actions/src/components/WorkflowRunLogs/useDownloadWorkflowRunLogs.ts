/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import useAsync from "react-use/lib/useAsync";
import githubActionsClient from "../../api/GithubActionsClient";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useDownloadWorkflowRunLogs = ({
  hostname,
  owner,
  repo,
  id,
}: {
  hostname?: string;
  owner: string;
  repo: string;
  id: number;
}) => {
  const details = useAsync(async () => {
    if (!repo || !owner) {
      throw Error("No repo/owner provided");
    }
    return await githubActionsClient.downloadJobLogsForWorkflowRun({
      hostname,
      owner,
      repo,
      runId: id,
    });
  }, [repo, owner, id]);
  return details;
};
