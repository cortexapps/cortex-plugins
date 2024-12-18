import {
  usePluginContext,
} from "@cortexapps/plugin-core/components";

import { useErrorToast } from "./uiHooks";
import { useCallback } from "react";

export const usePluginUpdateFns = () => {
  const errorToast = useErrorToast();
  const { apiBaseUrl } = usePluginContext();
  const apiOrigin = apiBaseUrl ? new URL(apiBaseUrl).origin : "";
  const internalBaseUrl = apiOrigin ? `${apiOrigin}/api/internal/v1` : "";

  const doAddSecret = useCallback(async (name: string, secret: string): Promise<boolean> => {
    if (!internalBaseUrl) {
      errorToast({
        title: "Failed to add secret",
        message: "Internal base URL not available",
      });
      return false;
    }
    const body = JSON.stringify({
      name,
      tag: name,
      secret,
    });

    try {
      const response = await fetch(`${internalBaseUrl}/secrets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response?.ok) {
        const message =
          (response as any).cortexResponse?.statusText ||
          response.statusText ||
          "An error occurred";
        throw new Error(message);
      }
      return true;
    } catch (e) {
      let message = e.message || "An error occurred";
      try {
        const data = JSON.parse(e.message);
        message = data.details || data.message || message;
      } catch (e) {
        // Ignore
      }
      errorToast({
        title: "Failed to add secret",
        message,
      });
    }
    return false;
  }, [internalBaseUrl, errorToast]);

  const doAddProxy = useCallback(async (name: string, tag: string, secretTag: string): Promise<boolean> => {
    if (!internalBaseUrl) {
      errorToast({
        title: "Failed to add proxy",
        message: "Internal base URL not available",
      });
      return false;
    }
    const body = JSON.stringify({
      name,
      tag,
      urlConfigurations: {
        "https://api.pagerduty.com": {
          urlHeaders: [
            {
              name: "Authorization",
              value: `Token token={{{secrets.${secretTag}}}}`,
            },
          ],
        },
      },
    });

    try {
      const response = await fetch(`${internalBaseUrl}/proxies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response?.ok) {
        const message =
          (response as any).cortexResponse?.statusText ||
          response.statusText ||
          "An error occurred";
        throw new Error(message);
      }
      return true;
    } catch (e) {
      console.error("Failed to add proxy", e);
      let message = e.message || "An error occurred";
      try {
        const data = JSON.parse(e.message);
        message = data.details || data.message || message;
      } catch (e) {
        // Ignore
      }
      errorToast({
        title: "Failed to add proxy",
        message,
      });
    }
    return false;
  }, [internalBaseUrl, errorToast]);

  const doUpdatePlugin = useCallback(async (pluginTag: string, uiBlobUrl: string, proxyTag: string): Promise<boolean> => {
    try {
      let response = await fetch(`${apiBaseUrl}/plugins/${pluginTag}`);
      if (!response.ok) {
        throw new Error("Failed to fetch plugin metadata");
      }
      const plugin = await response.json();
      const pluginDescription = plugin.description || "";
      if (
        !pluginDescription.includes(
          "plugin-marketplace"
        )
      ) {
        throw new Error(
          "This pagerduty-incidents plugin was not installed by the Plugin Marketplace"
        );
      }
      response = await fetch(uiBlobUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch plugin UI");
      }
      const ui = await response.text();
      plugin.proxyTag = proxyTag;
      plugin.blob = ui;
      response = await fetch(`${apiBaseUrl}/plugins/${pluginTag}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plugin),
      });
      if (!response.ok) {
        throw new Error("Failed to update plugin");
      }
      return true;
    } catch (e) {
      console.error("Failed to update plugin", e);
      let message = e.message || "An error occurred";
      try {
        const data = JSON.parse(e.message);
        message = data.details || data.message || message;
      } catch (e) {
        // Ignore
      }
      errorToast({
        title: "Failed to update plugin",
        message,
      });
    }
    return false;
  }, [apiBaseUrl, errorToast]);

  return {
    doAddSecret,
    doAddProxy,
    doUpdatePlugin,
  }
}