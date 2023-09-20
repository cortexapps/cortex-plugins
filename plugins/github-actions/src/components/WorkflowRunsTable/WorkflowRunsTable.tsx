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
import {
  Typography,
  Box,
  IconButton,
  Tooltip,
  Button,
} from "@material-ui/core";
import RetryIcon from "@material-ui/icons/Replay";
import GitHubIcon from "@material-ui/icons/GitHub";
import { Link as RouterLink } from "react-router-dom";
import { useWorkflowRuns, type WorkflowRun } from "../useWorkflowRuns";
import { WorkflowRunStatus } from "../WorkflowRunStatus";
import SyncIcon from "@material-ui/icons/Sync";

import {
  EmptyState,
  Table,
  type TableColumn,
} from "@backstage/core-components";
import {
  type CortexDomain,
  type CortexResource,
  type CortexService,
} from "@cortexapps/plugin-core";
import { useContext } from "react";
import { GithubEntityContext } from "../GithubEntityProvider";

const generatedColumns: TableColumn[] = [
  {
    title: "ID",
    field: "id",
    type: "numeric",
    width: "150px",
  },
  {
    title: "Message",
    field: "message",
    highlight: true,
    render: (row: Partial<WorkflowRun>) => {
      const LinkWrapper: React.FC = () => {
        return (
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          <RouterLink to={`github-actions/build/${row.id!}`}>
            {row.message}
          </RouterLink>
        );
      };

      return <LinkWrapper />;
    },
  },
  {
    title: "Source",
    render: (row: Partial<WorkflowRun>) => (
      <Typography variant="body2" noWrap>
        <Typography paragraph variant="body2">
          {row.source?.branchName}
        </Typography>
        <Typography paragraph variant="body2">
          {row.source?.commit.hash}
        </Typography>
      </Typography>
    ),
  },
  {
    title: "Workflow",
    field: "workflowName",
  },
  {
    title: "Status",
    width: "150px",

    render: (row: Partial<WorkflowRun>) => (
      <Box display="flex" alignItems="center">
        <WorkflowRunStatus status={row.status} conclusion={row.conclusion} />
      </Box>
    ),
  },
  {
    title: "Actions",
    render: (row: Partial<WorkflowRun>) => (
      <Tooltip title="Rerun workflow">
        <IconButton onClick={row.onReRunClick}>
          <RetryIcon />
        </IconButton>
      </Tooltip>
    ),
    width: "10%",
  },
];

interface Props {
  loading: boolean;
  retry: () => void;
  runs?: WorkflowRun[];
  projectName: string;
  page: number;
  onChangePage: (page: number) => void;
  total: number;
  pageSize: number;
  onChangePageSize: (pageSize: number) => void;
}

export const WorkflowRunsTableView: React.FC<Props> = ({
  projectName,
  loading,
  pageSize,
  page,
  retry,
  runs,
  onChangePage,
  onChangePageSize,
  total,
}) => {
  return (
    <Table
      isLoading={loading}
      options={{ paging: true, pageSize, padding: "dense" }}
      totalCount={total}
      page={page}
      actions={[
        {
          icon: () => <SyncIcon />,
          tooltip: "Reload workflow runs",
          isFreeAction: true,
          onClick: () => {
            retry();
          },
        },
      ]}
      data={runs ?? []}
      onPageChange={onChangePage}
      onRowsPerPageChange={onChangePageSize}
      style={{ width: "100%" }}
      title={
        <Box display="flex" alignItems="center">
          <GitHubIcon />
          <Box mr={1} />
          <Typography variant="h6">{projectName}</Typography>
        </Box>
      }
      columns={generatedColumns}
    />
  );
};

export const WorkflowRunsTable: React.FC<{
  entity: CortexDomain | CortexResource | CortexService;
  branch?: string;
}> = ({ branch }) => {
  const { owner, repo } = useContext(GithubEntityContext);
  const hostname = "github.com"; // todo: read from entity yaml
  const [{ runs, ...tableProps }, { retry, setPage, setPageSize }] =
    useWorkflowRuns({
      hostname,
      owner,
      repo,
      branch,
    });

  const githubHost = hostname || "github.com";
  const hasNoRuns = !tableProps.loading && !runs;

  return hasNoRuns ? (
    <EmptyState
      missing="data"
      title="No Workflow Data"
      description="This component has GitHub Actions enabled, but no data was found. Have you created any Workflows? Click the button below to create a new Workflow."
      action={
        <Button
          variant="contained"
          color="primary"
          href={`https://${githubHost}/${owner}/${repo}/actions/new`}
          target={"_blank"}
        >
          Create new Workflow
        </Button>
      }
    />
  ) : (
    <WorkflowRunsTableView
      {...tableProps}
      runs={runs}
      loading={tableProps.loading}
      retry={retry}
      onChangePageSize={setPageSize}
      onChangePage={setPage}
    />
  );
};
