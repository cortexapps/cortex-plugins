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
export const useWorkflowRunsDetails = ({
  hostname,
  id,
  owner,
  repo,
}: {
  hostname?: string;
  id: string;
  owner: string;
  repo: string;
}) => {
  const details = useAsync(async () => {
    return repo && owner
      ? await githubActionsClient.getWorkflowRun({
          hostname,
          owner,
          repo,
          id: parseInt(id, 10),
        })
      : await Promise.reject(new Error("No repo/owner provided"));
  }, [repo, owner, id]);
  return details;
};
