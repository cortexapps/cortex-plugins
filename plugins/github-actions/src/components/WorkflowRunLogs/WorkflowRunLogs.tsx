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

import { LogViewer } from "@backstage/core-components";
import {
  Accordion,
  AccordionSummary,
  CircularProgress,
  Fade,
  makeStyles,
  Modal,
  type Theme,
  Tooltip,
  Typography,
  Zoom,
} from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useContext } from "react";
import { useDownloadWorkflowRunLogs } from "./useDownloadWorkflowRunLogs";
import {
  type CortexDomain,
  type CortexResource,
  type CortexService,
} from "@cortexapps/plugin-core";
import { GithubEntityContext } from "../GithubEntityProvider";

type Entity = CortexDomain | CortexResource | CortexService;

const useStyles = makeStyles<Theme>((theme) => ({
  button: {
    order: -1,
    marginRight: 0,
    marginLeft: "-20px",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    width: "85%",
    height: "85%",
    justifyContent: "center",
    margin: "auto",
  },
  normalLogContainer: {
    height: "75vh",
    width: "100%",
  },
  modalLogContainer: {
    height: "100%",
    width: "100%",
  },
  log: {
    background: theme.palette.background.default,
  },
}));

/**
 * A component for Run Logs visualization.
 */
export const WorkflowRunLogs: React.FC<{
  entity: Entity;
  runId: number;
  inProgress: boolean;
}> = ({ runId, inProgress }) => {
  const classes = useStyles();
  const { owner, repo } = useContext(GithubEntityContext);

  const hostname = "github.com"; // todo: read from entity yaml
  const jobLogs = useDownloadWorkflowRunLogs({
    hostname,
    owner,
    repo,
    id: runId,
  });
  const logText = jobLogs.value ? String(jobLogs.value) : undefined;
  const [open, setOpen] = React.useState(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} disabled={inProgress}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        IconButtonProps={{
          className: classes.button,
        }}
      >
        <Typography variant="button">
          {jobLogs.loading ? <CircularProgress /> : "Job Log"}
        </Typography>
        <Tooltip title="Open Log" TransitionComponent={Zoom} arrow>
          <DescriptionIcon
            onClick={(event) => {
              event.stopPropagation();
              handleOpen();
            }}
            style={{ marginLeft: "auto" }}
          />
        </Tooltip>
        <Modal
          className={classes.modal}
          onClick={(event) => {
            event.stopPropagation();
          }}
          open={open}
          onClose={handleClose}
        >
          <Fade in={open}>
            <div className={classes.modalLogContainer}>
              <LogViewer
                text={logText ?? "No Values Found"}
                classes={{ root: classes.log }}
              />
            </div>
          </Fade>
        </Modal>
      </AccordionSummary>
      {logText && (
        <div className={classes.normalLogContainer}>
          <LogViewer text={logText} classes={{ root: classes.log }} />
        </div>
      )}
    </Accordion>
  );
};
