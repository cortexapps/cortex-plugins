# Attestation

Provides a form for Service Owners to attest that their service is compliant and/or meets certain standards.

## Overview

The attestation plugin provides a starting point to provide end users with a form to attest to compliance related questions. The responses are saved as custom data, and thus available to score and report via CQL.

The plugin comes with four sample placeholder questions that need to be replaced with questions that are relevant to you. The sample questions are inspired by the [Secure Software Development Attestation Common From](https://www.cisa.gov/sites/default/files/2023-04/secure-software-self-attestation_common-form_508.pdf).

It is expected that you will need to make some moderate changes to this plugin to make it fit your use case. At the least, you will update the questions and related objects like variables, table column headings, etc... However, if you know your way around Typescript and React, you could add other form controls as well and any other enhancements you need.

## How it works

The plugin is meant to be used at the entity level and will not work if accessed otherwise. A service owner is able to use this plugin to attest that their service meets certain standards by answering `yes`, `no` or `n/a` to pre defined questions. Once they submit their answers, the plugin saves these answers along with the Attestee and date to the entity's custom data. This makes the reponses available to Scorecards, CQL Reports, etc...

### Plugin Sections

The plugin has three main sections:

#### 1. Previous Attestation

The top of the screen will show you the previous attestation.

![Previous Attestations](img/attestations.png)

In its out of the box state, the table displays the following information:

**Date:** The date when the previous attestation was performed.

**Signed By:** The logged in user that performed the attestation

The remaining columns map to the sample questions included out of the box. You will replace these based on the questions you add to the plugin.

If no previous attestation has occurred, a message is displayed.

![No Attestations](img/no_attestations.png)

#### 2. Submitting a new attestation

Check the "Submit new attestation" box to display the attestation form. Keep in mind that at this time this option is available to anyone that can access the plugin.

#### 3. Submit Form

The form contains only four select controls, each with a `<Text/>` object that contains a question. Replace this with the questions that make sense for your use cases. You may also decide to add different controls (like a radio button) but you will need to add the code to handle that control.

![Sample Form](img/sample_form.png)

Once the form is successfully submitted it will display a message box

![success](img/success.png)

When the user clicks on the **OK** button, the form is reloaded and the it will revert to only showing the previos attestation section, which should now display the attestation just submitted.

The plugin saves the information as [custom data](https://docs.cortex.io/docs/reference/basics/custom-data) attached to the current entity.

![Custom Data](img/custom-data.png)

Since the data is saved as custom data, this means you can write rules for it in scorecards and query results using our Query Builder and CQL Reports.

## Example Scorecard

To help you get started with scorecards, we've included a sample scorecard that evaluate the questions that comes with the plugin. In this example, if the attestee answers `yes` to all questions, the service is considered `compliant`, otherwise it is considered `non-compliant`.

![Sample Scorecard](img/scorecard.png)

### Scorecard Yaml

```yaml
tag: compliance-check
name: Compliance Check
draft: true
rules:
  - title:
      The software producer maintains provenance data for internal and third-party
      code incorporated into the software
    expression:
      "jq(custom(\"checklist\"), \".[0].\\\"provenanceData\\\"\").matches(\"\
      Yes\") "
    weight: 1
    filter:
      category: SERVICE
  - title: The software was developed and built in secure environments.
    expression:
      "jq(custom(\"checklist\"), \".[0].\\\"secureEnv\\\"\").matches(\"Yes\"\
      )"
    weight: 1
    filter:
      category: SERVICE
  - title:
      The software producer employed automated tools or comparable processes that
      check for security vulnerabilities
    expression:
      "jq(custom(\"checklist\"), \".[0].\\\"secVuln\\\"\").matches(\"Yes\"\
      ) "
    weight: 1
    filter:
      category: SERVICE
  - title:
      The software producer has made a good-faith effort to maintain trusted source
      code supply chains
    expression:
      "jq(custom(\"checklist\"), \".[0].\\\"trustedSource\\\"\").matches(\"\
      Yes\") "
    weight: 1
    filter:
      category: SERVICE
filter:
  category: SERVICE
```

The sample scorecard allows to track compliance at the service level.

![Service Scorecard](img/service_score.png)

And also at the team level.

![BirdsEye Report](img/birdseye.png)

You can also leverage initiatives so Cortex can send weekly reminders to each service owner that owns services that are not compliant.

## Adding your own questions

The plugin comes with three select controls each with a placeholder Text control. Replace the contents with of the Text object with your own questions. Rename the variables and refactor as appropriate.

## Setting up your Dev Environment

Attest is a [Cortex](https://www.cortex.io/) plugin. To see how to run the plugin inside of Cortex, see [our docs](https://docs.cortex.io/docs/plugins).

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
