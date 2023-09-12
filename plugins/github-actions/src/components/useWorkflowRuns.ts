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
import { useState } from "react";
import useAsyncRetry from "react-use/lib/useAsyncRetry";
import githubActionsClient from "../api/GithubActionsClient";

export interface WorkflowRun {
  workflowName?: string;
  id: string;
  message?: string;
  url?: string;
  githubUrl?: string;
  source: {
    branchName?: string;
    commit: {
      hash?: string;
      url?: string;
    };
  };
  status?: string;
  conclusion?: string;
  onReRunClick: () => void;
}

interface RunMetadata {
  page: number;
  pageSize: number;
  loading: boolean;
  runs?: WorkflowRun[];
  projectName: string;
  total: number;
  error?: Error;
}

interface RunActions {
  runs?: WorkflowRun[];
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  retry: () => void;
}

export function useWorkflowRuns({
  hostname,
  owner,
  repo,
  branch,
  initialPageSize = 5,
}: {
  hostname?: string;
  owner: string;
  repo: string;
  branch?: string;
  initialPageSize?: number;
}): readonly [RunMetadata, RunActions] {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const {
    loading,
    value: runs,
    retry,
    error,
  } = useAsyncRetry<WorkflowRun[]>(async () => {
    console.log(`==== useWorkflowRuns`, {
      fn: githubActionsClient.listWorkflowRuns,
      githubActionsClient,
    });
    // GitHub API pagination count starts from 1
    const workflowRunsData = await githubActionsClient.listWorkflowRuns({
      hostname,
      owner,
      repo,
      pageSize,
      page: page + 1,
      branch,
    });

    console.log(`===== useWorkflowRuns found data:`, { workflowRunsData });

    setTotal(workflowRunsData.total_count);
    // Transformation here
    return workflowRunsData.workflow_runs.map((run: Record<string, any>) => ({
      workflowName: run.name ?? undefined,
      message: run.head_commit?.message,
      id: `${run.id as number}`,
      onReRunClick: async () => {
        try {
          await githubActionsClient.reRunWorkflow({
            hostname,
            owner,
            repo,
            runId: run.id,
          });
        } catch (e) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          console.error(`Failed to rerun the workflow: ${e.message}`);
        }
      },
      source: {
        branchName: run.head_branch ?? undefined,
        commit: {
          hash: run.head_commit?.id,
          url: run.head_repository?.branches_url?.replace(
            "{/branch}",
            run.head_branch ?? ""
          ),
        },
      },
      status: run.status ?? undefined,
      conclusion: run.conclusion ?? undefined,
      url: run.url,
      githubUrl: run.html_url,
    }));
  }, [page, pageSize, repo, owner]);

  return [
    {
      page,
      pageSize,
      loading,
      runs,
      projectName: `${owner}/${repo}`,
      total,
      error,
    },
    {
      runs,
      setPage,
      setPageSize,
      retry,
    },
  ] as const;
}
