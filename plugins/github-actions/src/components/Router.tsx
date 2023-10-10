import { Routes, Route } from "react-router-dom";
import { WorkflowRunDetails } from "./WorkflowRunDetails";
import { WorkflowRunsTable } from "./WorkflowRunsTable";
import { EmptyState } from "@backstage/core-components";
import { useContext } from "react";
import { GithubEntityContext } from "./GithubEntityProvider";
import { usePluginContext } from "@cortexapps/plugin-core/components";

export const Router: React.FC = () => {
  const { owner, repo } = useContext(GithubEntityContext);
  const context = usePluginContext();

  if (!context?.entity) {
    return <EmptyState missing="info" title="No entity in context" />;
  }

  if (!repo || !owner) {
    return (
      <EmptyState
        description={
          "Cannot find any GitHub Actions associated with this entity"
        }
        missing="info"
        title="No GitHub Actions available"
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<WorkflowRunsTable entity={context.entity} />} />
      <Route
        path={`/github-actions/build`}
        element={<WorkflowRunDetails entity={context.entity} />}
      />
    </Routes>
  );
};
