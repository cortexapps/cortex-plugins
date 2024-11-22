export interface CortexResponseErrorReturn {
  status: number;
  message: string;
}

export const cortexResponseError = (
  response: Response
): CortexResponseErrorReturn => {
  const status = response.status;
  let message = "Unknown error";
  try {
    const r = response as any;
    const cMsg = r.cortexResponse?.statusText;
    message = cMsg || message;
  } catch (e) {}
  return { status, message };
};
