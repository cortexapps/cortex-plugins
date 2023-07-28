# GitHub Issues Cortex Plugin

View GitHub Issues associated to your services!

The GitHub Issues shows the open GitHub issues associated to the GitHup repository specified in the entity's `cortex.yaml`. If the `cortex.yaml` has a `basepath` defined in its `x-cortex-git` configuration, it will query for issues filtering by a label that matches to tag of the entity.

<img src="img/ghplugins.png" width="400" />

## SetUp

This plugin requires a proxy to GitHub. The API that the plugin uses is documented [here](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#list-repository-issues), which details the type of headers you need defined.

- Define a secret that contains your GitHub Personal Access Token
- Define a proxy that is pointed to your GitHub instance with the headers mentioned in the docs. Here is a screenshot of how your proxy may look like:
  ![Proxy](img/gh-proxy.png)
- Register the plugin.
  - This plan will not work on the Global context.
  - Select the entity that will have the GitHub repo in its `cortex.yaml`

# Setting up your dev environment

GitHub Issues Cortex Plugin is a [Cortex](https://www.cortex.io/) plugin. To see how to run the plugin inside of Cortex, see [our docs](https://docs.cortex.io/docs/plugins).

### Prerequisites

Developing and building this plugin requires either [yarn](https://classic.yarnpkg.com/lang/en/docs/install/) or [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

## Getting started

1. Run `yarn` or `npm install` to download all dependencies
2. Run `yarn build` or `npm run build` to compile the plugin code into `./dist/ui.html`
3. Upload `ui.html` into Cortex on a create or edit plugin page
4. Add or update the code and repeat steps 2-3 as necessary

### Notable scripts

The following commands come pre-configured in this repository. You can see all available commands in the `scripts` section of [package.json](./package.json). They can be run with npm via `npm run {script_name}` or with yarn via `yarn {script_name}`, depending on your package manager preference. For instance, the `build` command can be run with `npm run build` or `yarn build`.

- `build` - compiles the plugin. The compiled code root is `./src/index.tsx` (or as defined by [webpack.config.js](webpack.config.js)) and the output is generated into `dist/ui.html`.
- `test` - runs all tests defined in the repository using [jest](https://jestjs.io/)
- `lint` - runs lint and format checking on the repository using [prettier](https://prettier.io/) and [eslint](https://eslint.org/)
- `lintfix` - runs eslint in fix mode to fix any linting errors that can be fixed automatically
- `formatfix` - runs Prettier in fix mode to fix any formatting errors that can be fixed automatically

### Available React components

See available UI components via our [Storybook](https://cortexapps.github.io/plugin-core/).
