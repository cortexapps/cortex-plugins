# Cortex Confluence Plugin

This plugin makes it possible to view Confluence assets alongside related entities in the service catalog, such as in this screenshot:

![Cortex Confluence Plugin Screenshot](images/confluence-plugin-screenshot.png)

This is a [Cortex](https://www.cortex.io/) plugin. To see how to run the plugin inside of Cortex, see [our docs](https://docs.cortex.io/docs/plugins).

### Prerequisites

The URL of your Confluence instance should be configured in `src/components/PageContent.tsx`. To do so, change the following line to match the URL of your server:

```
const baseConfluenceUrl = "https://confluence-server.atlassian.net";
```

Developing and building this plugin requires either [yarn](https://classic.yarnpkg.com/lang/en/docs/install/) or [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

## Getting started

1. Modify the `src/components/PageContent.tsx` file as described above
2. Run `yarn` to download all dependencies
3. Run `yarn build` to compile the plugin code into `./dist/ui.html`
4. Upload `ui.html` into Cortex on a create or edit plugin page
5. Add or update the code and repeat steps 2-3 as necessary

## Adding Confluence Content

Entities can be associated with Confluence Page IDs by adding a PageID tag to the `x-cortex-confluence` object. In the Entity yaml for the entity to the Page ID that you'd like to view inside of Cortex, such as:

```
x-cortex-confluence:
  pageID: "123456"
```

You can do this for Custom Entities, as well as any Service entity. 

