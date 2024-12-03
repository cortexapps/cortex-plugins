# Best Practices Guide

This document outlines best practices for developing plugins in React and TypeScript for the [Cortex.io](http://cortex.io/) Plugin Community. Following these guidelines ensures consistent, maintainable, and high-quality plugins.

## Project Structure

Plugins should be Scaffolded in Cortex using the “Cortex Plugin” template and will match the following project structure:

```jsx
__mocks__/
src/
   api/
      Cortex.ts
   assets/
      logo.svg
   components/
      App.test.tsx
      App.tsx
      ErrorBoundary.tsx
      PluginContext.tsx
   baseStyles.css
   index.html
   index.tsx
   typings.d.ts   
.eslintignore
.eslintrc.js
.gitignore
.prettierignore
README.md
babel.config.js
cortex.yaml
jest.config.js
package.json
setupTests.ts
tsconfig.json
webpack.config.js
```

## Code Style

1. **Linting and Formatting**:
    - Use **ESLint** with React and TypeScript plugins to enforce consistent code style.
    - Use **Prettier** for formatting. Configure Prettier to auto-format code on save.

### Configuration for ESLint

```
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "standard-with-typescript",
    "prettier",
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    project: "tsconfig.json",
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  plugins: ["react"],
  rules: {
    // conflicts with no-extra-boolean-cast
    "@typescript-eslint/strict-boolean-expressions": "off",
    "no-console": ["error", { allow: ["warn", "error"] }],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
```

## Unit Testing

- **Coverage Requirement**: Aim for 80% test coverage. Prioritize testing key functions and complex logic. You can use Istanbul (baked into Yarn) to check your coverage, like:

```markup
yarn test --coverage
```

- **Testing Library**: Use **Jest** and **React Testing Library** for unit tests.
- **Testing Standards**:
    - Test each component’s rendered output.
    - Mock API calls and test component behavior based on different responses.
    - Test edge cases and error handling.

## Example Unit Test

```jsx
  it("Shows a page if page is found", async () => {
    fetchMock.mockResponses(
      [JSON.stringify(serviceYaml), { status: 200 }],
      [JSON.stringify(mockPageContent), { status: 200 }]
    );

    render(<PageContent />);
    await waitFor(() => {
      expect(screen.queryByText("AppDirect Runbook")).toBeInTheDocument();
    });
  });
```

## Documentation and Comments

1. **README**: Provide a clear README file for each plugin with installation, usage, and basic configuration instructions, ideally with a screenshot of the plugin.
2. Clearly document which types of entities the plugin is compatible with
3. **Code Comments**:
    - Use comments sparingly for complex logic or non-obvious code.
    - Avoid redundant comments that describe straightforward code.
