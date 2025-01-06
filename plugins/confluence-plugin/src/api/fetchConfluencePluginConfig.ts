export const fetchConfluencePluginConfig = async (
  apiBaseUrl: string
): Promise<string> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/catalog/confluence-plugin-config/openapi`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.info["x-cortex-definition"]["confluence-url"];
  } catch (error) {
    throw error;
  }
};
