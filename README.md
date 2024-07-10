# cortex-plugins

This is a monorepo housing Cortex-maintained plugins for Cortex. All available plugins live inside of [the `plugins` directory](./plugins/), plus an example [Scaffolded](https://www.cortex.io/products/scaffolder) plugin. Each plugin is a separate package that can be built and deployed independently.

## Available plugins

### GitHub Actions

The GitHub Actions plugin allows you to manage GitHub Actions and Workflows from Cortex. This plugin is useful for automating workflows that are triggered by Cortex events.

See the [GitHub Actions plugin README](./plugins/github-actions/README.md) for more information.

### GitHub Releases

The GitHub Releases plugin provides a view of all Releases for a GitHub repository from Cortex.

See the [GitHub Releases plugin README](./plugins/github-releases/README.md) for more information.

### GitHub Issues

The GitHub Issues plugin provides a view of all Issues for a GitHub repository from Cortex.

See the [GitHub Issues plugin README](./plugins/github-issues/README.md) for more information.

## Using a plugin

To use one or multiple of these plugins, we recommend first forking this repository. Then, in the desired plugin subdirectory, run `yarn build` to generate the plugin code that will be executed by Cortex. Finally, in Cortex, register a new plugin and upload the generated `dist/ui.html` file to serve as the plugin code.

Be sure to follow any additional setup instructions in the plugin's README.md file, particularly for proxy configuration setup.

## Adding or updating a plugin

For information on adding or updating a plugin, see [CONTRIBUTING.md](./CONTRIBUTING.md).
