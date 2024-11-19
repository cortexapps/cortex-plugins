export const successMockBodies = {
  "https://api.cortex.dev/catalog/confluence-plugin-config/openapi": {
    info: {
      "x-cortex-definition": {
        "confluence-url":
          "https://unit-testing-confluence-instance.atlassian.net",
      },
    },
  },
  "https://api.cortex.dev/catalog/inventory-planner/openapi": {
    info: {
      title: "Inventory Planner",
      description: "it is a inventory planner",
      "x-cortex-tag": "inventory-planner",
      "x-cortex-type": "service",
      "x-cortex-confluence": { pageID: 131073 },
    },
    openapi: "3.0.1",
    servers: [
      {
        url: "/",
      },
    ],
  },
  "https://unit-testing-confluence-instance.atlassian.net/wiki/rest/api/content/131073":
    {
      id: "131073",
      type: "page",
      status: "current",
      title: "AppDirect Runbook",
      macroRenderedOutput: {},
      body: {
        view: {
          value:
            '<p><style>[data-colorid=kggi8475gd]{color:#bf2600} html[data-color-mode=dark] [data-colorid=kggi8475gd]{color:#ff6640}</style><strong>This document describes what we do when it breaks!</strong></p><p><br />Step 1 - <span data-colorid="kggi8475gd">EVERYBODY</span> PANIC!!!!!!!</p><p>Step2 - Run to the hills</p><p>Step3 - Run for your lives</p><p /><h2 id="AppDirectRunbook-ArchitecturalDigram">Architectural Digram</h2><span class="confluence-embedded-file-wrapper image-center-wrapper confluence-embedded-manual-size"><img class="confluence-embedded-image image-center" alt="cloud_infrastructure (3).png" width="760" loading="lazy" src="https://cortex-se-test.atlassian.net/wiki/download/thumbnails/131073/cloud_infrastructure%20(3).png?version=1&amp;modificationDate=1706209753278&amp;cacheVersion=1&amp;api=v2&amp;width=760&amp;height=888" data-image-src="https://cortex-se-test.atlassian.net/wiki/download/attachments/131073/cloud_infrastructure%20(3).png?version=1&amp;modificationDate=1706209753278&amp;cacheVersion=1&amp;api=v2" data-height="1632" data-width="1396" data-unresolved-comment-count="0" data-linked-resource-id="2523157" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="cloud_infrastructure (3).png" data-base-url="https://cortex-se-test.atlassian.net/wiki" data-linked-resource-content-type="image/png" data-linked-resource-container-id="131073" data-linked-resource-container-version="4" data-media-id="d04b592d-798d-486e-80af-6af581929d0b" data-media-type="file" srcset="https://cortex-se-test.atlassian.net/wiki/download/thumbnails/131073/cloud_infrastructure%20(3).png?version=1&amp;modificationDate=1706209753278&amp;cacheVersion=1&amp;api=v2&amp;width=1095&amp;height=1280 2x, https://cortex-se-test.atlassian.net/wiki/download/thumbnails/131073/cloud_infrastructure%20(3).png?version=1&amp;modificationDate=1706209753278&amp;cacheVersion=1&amp;api=v2&amp;width=760&amp;height=888 1x" /></span><p />',
          representation: "view",
          _expandable: {
            webresource: "",
            embeddedContent: "",
            mediaToken: "",
            content: "/rest/api/content/131073",
          },
        },
        _expandable: {
          editor: "",
          atlas_doc_format: "",
          export_view: "",
          styled_view: "",
          dynamic: "",
          storage: "",
          editor2: "",
          anonymous_export_view: "",
        },
      },
    },
};

export const noEntityMockBodies = {
  ...successMockBodies,
  "https://api.cortex.dev/catalog/inventory-planner/openapi": {
    info: {
      title: "Inventory Planner",
      description: "it is a inventory planner",
      "x-cortex-tag": "inventory-planner",
      "x-cortex-type": "service",
    },
    openapi: "3.0.1",
    servers: [
      {
        url: "/",
      },
    ],
  },
};
