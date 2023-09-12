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

import { type GithubActionsApi } from "./GithubActionsApi";
import { Octokit, type RestEndpointMethodTypes } from "@octokit/rest";

/**
 * A client for fetching information about GitHub actions.
 *
 * @public
 */
export class GithubActionsClient implements GithubActionsApi {
  private async getOctokit(): Promise<Octokit> {
    // todo: use CortexClient.proxyFetch
    // todo: customize baseUrl for GHE
    return new Octokit();
  }

  async reRunWorkflow(options: {
    hostname?: string;
    owner: string;
    repo: string;
    runId: number;
  }): Promise<any> {
    const { owner, repo, runId } = options;

    const octokit = await this.getOctokit();
    const result = await octokit.actions.reRunWorkflow({
      owner,
      repo,
      run_id: runId,
    });
    return result;
  }

  async listWorkflowRuns(options: {
    hostname?: string;
    owner: string;
    repo: string;
    pageSize?: number;
    page?: number;
    branch?: string;
  }): Promise<
    RestEndpointMethodTypes["actions"]["listWorkflowRuns"]["response"]["data"]
  > {
    console.log(`====== listWorkflowRuns`);
    const { owner, repo, pageSize = 100, page = 0, branch } = options;

    const octokit = await this.getOctokit();
    const workflowRuns = await octokit.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      per_page: pageSize,
      page,
      ...(branch ? { branch } : {}),
    });

    console.log(`====== listWorkflowRuns`, { data: workflowRuns.data });

    return workflowRuns.data;
  }

  async getWorkflow(options: {
    hostname?: string;
    owner: string;
    repo: string;
    id: number;
  }): Promise<
    RestEndpointMethodTypes["actions"]["getWorkflow"]["response"]["data"]
  > {
    console.log(`==== getWorkflow`);
    const { owner, repo, id } = options;

    const octokit = await this.getOctokit();
    const workflow = await octokit.actions.getWorkflow({
      owner,
      repo,
      workflow_id: id,
    });

    return workflow.data;
  }

  async getWorkflowRun(options: {
    hostname?: string;
    owner: string;
    repo: string;
    id: number;
  }): Promise<
    RestEndpointMethodTypes["actions"]["getWorkflowRun"]["response"]["data"]
  > {
    const { owner, repo, id } = options;

    const octokit = await this.getOctokit();
    const run = await octokit.actions.getWorkflowRun({
      owner,
      repo,
      run_id: id,
    });

    return run.data;
  }

  async listJobsForWorkflowRun(options: {
    hostname?: string;
    owner: string;
    repo: string;
    id: number;
    pageSize?: number;
    page?: number;
  }): Promise<
    RestEndpointMethodTypes["actions"]["listJobsForWorkflowRun"]["response"]["data"]
  > {
    const { owner, repo, id, pageSize = 100, page = 0 } = options;

    const octokit = await this.getOctokit();
    const jobs = await octokit.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: id,
      per_page: pageSize,
      page,
    });

    return jobs.data;
  }

  async downloadJobLogsForWorkflowRun(options: {
    hostname?: string;
    owner: string;
    repo: string;
    runId: number;
  }): Promise<
    RestEndpointMethodTypes["actions"]["downloadJobLogsForWorkflowRun"]["response"]["data"]
  > {
    console.log(`=== downloadJobLogsForWorkflowRun`);
    const { owner, repo, runId } = options;

    const octokit = await this.getOctokit();
    const workflow = await octokit.actions.downloadJobLogsForWorkflowRun({
      owner,
      repo,
      job_id: runId,
    });

    return workflow.data;
  }
}

const githubActionsClient = new GithubActionsClient();

export default githubActionsClient;
