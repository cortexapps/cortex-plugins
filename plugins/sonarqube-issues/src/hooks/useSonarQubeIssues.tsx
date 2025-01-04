import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";

const getErrorMessageFromResponse = async (
  response: Response
): Promise<string> => {
  if (response.headers.get("Content-Type")?.includes("application/json")) {
    try {
      const json = await response.json();
      return json.message || response.statusText || response.status.toString();
    } catch (e) {
      return response.statusText || response.status.toString();
    }
  }
  return response.statusText || response.status.toString();
};

export interface UseSonarQubeIssuesReturn {
  issues: any[];
  hasIssues: boolean;
  isLoading: boolean;
  totalIssues: number;
}

export const useSonarQubeIssues = (
  baseUrl: string,
  project: string,
  currentPage: number,
  itemsPerPage: number
): UseSonarQubeIssuesReturn => {
  const [issues, setIssues] = useState([]);
  const [hasIssues, setHasIssues] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalIssues, setTotalIssues] = useState(0);
  const toast = useToast();

  useEffect(() => {
    if (!project || !baseUrl) {
      setIsLoading(false);
      return;
    }

    const fetchIssues = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const issueUrl = `${baseUrl}/api/issues/search?componentKeys=${project}&resolved=false&s=CREATION_DATE&asc=false&p=${currentPage}&ps=${itemsPerPage}`;
        const response = await fetch(issueUrl);
        if (!response.ok) {
          throw new Error(await getErrorMessageFromResponse(response));
        }
        const data = await response.json();

        if (data.issues instanceof Array && data.issues.length > 0) {
          setIssues(data.issues);
          setHasIssues(true);
          setTotalIssues(data.total);
        }
      } catch (err) {
        const msg: string = err.message || err.toString();
        toast({
          title: `Failed to fetch issues: ${msg}`,
          status: "error",
          duration: null,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    void fetchIssues();
  }, [baseUrl, project, currentPage, itemsPerPage, toast]);

  return { issues, hasIssues, isLoading, totalIssues };
};
