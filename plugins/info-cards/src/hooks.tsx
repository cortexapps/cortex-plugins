import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

import type { UseMutationResult } from "@tanstack/react-query";

import { usePluginContext } from "@cortexapps/plugin-core/components";

export interface UseEntityDescriptorProps {
  entityTag: string;
  mutationMethod?: "PATCH" | "POST";
  onMutateSuccess?: (data: any, variables: any, context?: any) => void;
  onMutateError?: (error: Error, variables: any, context?: any) => void;
  onMutateSettled?: (
    data: any,
    error: Error,
    variables: any,
    context?: any
  ) => void;
  onMutate?: (variables: any) => void;
}

export interface UseEntityDescriptorReturn {
  entity: any;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  updateEntity: UseMutationResult<any, Error, any>["mutate"];
  isMutating: boolean;
}

export const useEntityDescriptor = ({
  entityTag,
  mutationMethod = "POST",
  onMutateSuccess = () => {},
  onMutateError = () => {},
  onMutateSettled = () => {},
  onMutate = () => {},
}: UseEntityDescriptorProps): UseEntityDescriptorReturn => {
  const { apiBaseUrl } = usePluginContext();

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["entityDescriptor", entityTag],
    queryFn: async () => {
      const response = await fetch(
        `${apiBaseUrl}/catalog/${entityTag}/openapi`
      );
      return await response.json();
    },
    enabled: !!apiBaseUrl,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      // throw if the data is not an object or data.info is not an object
      if (typeof data !== "object" || typeof data.info !== "object") {
        throw new Error("Invalid data format");
      }
      // make sure basic info is set
      data.openapi = "3.0.1";
      // don't allow changing the tag
      data.info["x-cortex-tag"] = entityTag;
      // set a title if it's not set
      if (!data.info.title) {
        data.info.title = entityTag
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
      }
      const response = await fetch(`${apiBaseUrl}/open-api`, {
        method: mutationMethod,
        headers: {
          "Content-Type": "application/openapi;charset=utf-8",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onMutate,
    onError: onMutateError,
    onSettled: onMutateSettled,
    onSuccess: (data, variables, context) => {
      void queryClient.invalidateQueries({
        queryKey: ["entityDescriptor", entityTag],
      });
      onMutateSuccess(data, variables, context);
    },
  });

  return {
    entity: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    updateEntity: mutation.mutate,
    isMutating: mutation.isPending,
  };
};
