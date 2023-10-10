# cortex-plugins

This is a monorepo housing Cortex-maintained plugins for Cortex. All available plugins live inside of the `plugins` directory, plus an example [Scaffolded](https://www.cortex.io/products/scaffolder) plugin. Each plugin is a separate package that can be built and deployed independently.

## Using a plugin

To use one or multiple of these plugins, we recommend first forking this repository. Then, in the desired plugin subdirectory, run `yarn build` to generate the plugin code that will be executed by Cortex. Finally, in Cortex, register a new plugin and upload the generated `dist/ui.html` file to serve as the plugin code.

Be sure to follow any additional setup instructions in the plugin's README.md file, particularly for proxy configuration setup.

## Adding or updating a plugin

For information on adding or updating a plugin, see [CONTRIBUTING.md](./CONTRIBUTING.md).
