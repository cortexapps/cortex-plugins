# cortex-plugins
This is a monorepo housing Cortex-maintained plugins for Cortex.

### Adding a plugin
1. Use Scaffolder to create a new plugin inside the `plugins` directory.
2. Update the `tsconfig.json` file `typeRoots` property to include types at the root of the repo, e.g.
   ```
   "typeRoots": ["../../node_modules/@types", "./node_modules/@types"],
   ```

