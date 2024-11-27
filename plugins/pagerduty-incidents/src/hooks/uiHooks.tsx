import { useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { cortexResponseError } from "../util";

interface ErrorToastProps {
    title?: string;
    message?: string;
  }
  
  export const useErrorToast = (): ((props: ErrorToastProps) => void) => {
    const toast = useToast();
    const errorToast = useCallback(
      ({ title = "Error", message = "An error occurred" }: ErrorToastProps) => {
        toast({
          title,
          description: message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
      [toast]
    );
  
    return errorToast;
  };
  
  export const useErrorToastForResponse = (): ((response: Response) => void) => {
    const errorToast = useErrorToast();
    const errorToastForResponse = useCallback(
      (response: Response) => {
        const { status, message } = cortexResponseError(response);
        errorToast({
          title: `HTTP Error ${status}`,
          message,
        });
      },
      [errorToast]
    );
  
    return errorToastForResponse;
  };
  