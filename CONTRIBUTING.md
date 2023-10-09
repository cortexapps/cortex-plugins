# Contributing to cortex-plugins

Thank you for your interest in contributing to cortex-plugins! We welcome contributions from the community.

## Adding a plugin

To add a new plugin, please follow these steps:

1. For the easiest setup, create a new Scaffolder template similar to the built-in for creating a Cortex plugin, but with a few different configurations to allow targeting a subdirectory of this repo. The template should be:

- Pointed at the repo https://github.com/cortexapps/cookiecutter-cortex-plugin
- "Requires a new service" should be enabled
- "Requires a new pull request" should be enabled
- (Optional) Add the tag "plugin" to ensure it can easily be found in the Scaffolder UI

2. Use this Scaffolder template to create a new plugin inside the `plugins` directory. Point it at this repo with the subdirectory `plugins/{plugin-name}` (replace "{plugin-name}" with the name of your plugin).
3. Update the `tsconfig.json` file `typeRoots` property to include types at the root of the repo, i.e.
   ```js
   "typeRoots": ["../../node_modules/@types", "./node_modules/@types"],
   ```
4. Update the jest.config.js module name mappings for @cortexapps/plugin-core to point at the root of the repo, i.e.
   ```js
   "@cortexapps/plugin-core/components":
    "<rootDir>/../../node_modules/@cortexapps/plugin-core/dist/components.cjs.js",
   "@cortexapps/plugin-core":
    "<rootDir>/../../node_modules/@cortexapps/plugin-core/dist/index.cjs.js",
   ```
5. Mark the PR as a draft until you're ready for a review
6. Code away at your plugin!
7. Ensure that the README.md for your plugin specifies any proxy setup expected for it to function properly.
8. When your plugin is ready for review, remove the draft status from the PR -- the Cortex team will automatically be notified to review.

## Updating a plugin

To update an existing plugin, please follow these steps:

1. Fork the repository and create a new branch for your changes.
1. Make your changes to the plugin.
1. Write tests for your changes.
1. Ensure that all tests pass.
1. Ensure that setup instructions are updated, if necessary. In particular, please note any changes in the proxy setup required for the plugin to function properly.
1. Submit a pull request with your changes -- the Cortex team will automatically be notified to review.

## Reporting issues

If you encounter any issues with cortex-plugins, please report them on the [issue tracker](https://github.com/cortexapps/plugin-core/issues).

Thank you for your contributions!

## FAQ

### What are expectations around testing?

All _major_ conditions should be tested using the existing testing tools ([Jest](https://jestjs.io/) + [testing-library](https://testing-library.com/docs/react-testing-library/intro/)). For instance, if your plugin pulls in data about an entity from a third party, at minimum the following test cases should be covered:

- There is no valid mapping between the entity in Cortex and the entity in the third party system
- There is a valid mapping between the entity in Cortex and the entity in the third party system, but the third party system does not have data for the entity
- There is a valid mapping between the entity in Cortex and the entity in the third party system and there is data for the entity in the third party system

### What does the `build` command do?

The `build` command uses [webpack](https://webpack.js.org/) to compile your plugin into a single html file (in `dist/ui.html`) that can be uploaded to Cortex for use.
