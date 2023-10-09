# cortex-plugins

This is a monorepo housing Cortex-maintained plugins for Cortex.

### Adding a plugin

1. Use Scaffolder to create a new plugin inside the `plugins` directory. **IMPORTANT**: use the "Plugin in cortex-plugins" template on tenant `cortex` in prod and point it at this repo with the subdirectory `plugins/{plugin-name}` (replace "{plugin-name}" with the name of your plugin).
2. Update the `tsconfig.json` file `typeRoots` property to include types at the root of the repo, 1.e.
   ```js
   "typeRoots": ["../../node_modules/@types", "./node_modules/@types"],
   ```
3. Update the `jest.config.js` module name mappings for `@cortexapps/plugin-core` to point at the root of the repo, i.e.
   ```js
   "@cortexapps/plugin-core/components":
      "<rootDir>/../../node_modules/@cortexapps/plugin-core/dist/components.cjs.js",
   "@cortexapps/plugin-core":
      "<rootDir>/../../node_modules/@cortexapps/plugin-core/dist/index.cjs.js",
   ```
