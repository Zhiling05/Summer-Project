
## testing workbook


We spent some time on environment configuration and needed to install different dependencies for different types of files.
Additionally, we spent time resolving TextEncoder errors and version incompatibility issues.
In this workbook, we will explain how to carry out testing tasks.

We plan to first conduct unit testing, then integration testing, and finally perform testing on the entire system. 
For each file, we will do all-round testing, including functional testing (to test core logic, buttons, API requests), boundary testing,
error handling testing, Performance/Loading Testing, snapshots and Accessibility Testing...


---

### Project Structure Overview

The root directory for testing is `docs/`. 
All test commands, dependency installations, and configs are executed and maintained from within the `docs/` working directory.
The Jest configuration file is located at `docs/jest.config.cjs`, and `jest.setup.ts`  is used for global setup (e.g., handling TextEncoder compatibility issues).

<br>

### Mocking Files and Resource Imports
Since image files *(e.g., .png, .svg)* cannot be directly parsed by Jest, I added a mock module in `src/__mocks__/fileMock.js` with the following content:

<pre>module.exports = 'test-file-stub';</pre>

In `jest.config.cjs`, the following **moduleNameMapper** configuration is added:
<pre>moduleNameMapper: {
'\\.(jpg|jpeg|png|svg)$': '<>/src/__mocks__/fileMock.js',
}
</pre>
Additionally, I defined the corresponding TypeScript types in `src/types/images.d.ts` to prevent type errors during compilation.

<br>

### Snapshot Testing
Snapshot testing is used to capture and compare the rendered output structure of a component. 
When you run a test containing `.toMatchSnapshot()`, Jest will generate or compare the snapshot files stored in the `_snapshots_` directory.
Snapshots are especially useful for detecting unexpected changes in a component’s UI.
If you make intentional changes to the UI, you can update the corresponding snapshots by running `npx jest -u`.

<br>

---
### Environment requirements
It is recommended to use `Node.js version 20.x`. 

Avoid using `v16.x` or `v24.x` as they may cause incompatibility issues with the frontend code.
Also, ensure that your `npm` version is `>=9.x` to match the Node version.

It is recommended to use `nvm` to manage your **Node.js** version in order to avoid inconsistent test behaviors across different systems.
Additionally, If you are using `nvm`, make sure the same version is configured in `.nvmrc`.

For example, by running ```npm ls ts-jest @testing-library/react jest @testing-library/jest-dom```，you should see:

<pre>
archi@0.0.0 /Users/Jing/Documents/Summer-Project/docs

├── @testing-library/jest-dom@6.6.3
├── @testing-library/react@16.3.0
├── jest@29.7.0
└─┬ ts-jest@29.4.0
└── jest@29.7.0 deduped
</pre>


<br>

---


### Installing dependencies

First, run `npm install` to set up all required dependencies.

The main dependencies are:
- `jest`
- `ts-jest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `jest-environment-jsdom`

In addition, there are special dependencies and configurations needed.
When using a Mac, we encountered issues where TextEncoder could not be resolved, so we added specific configurations in `jest.setup.ts`.

---

### Configuration file explanation

`jest.config.cjs`
- preset: ts-jest
- testEnvironment: jsdom
- setupFilesAfterEnv: imports jest.setup.ts
- moduleNameMapper: handles imports of static resources like `jpg`,`png`and`svg`


`tsconfig.json & tsconfig.app.json`
- We set `jsx` to `react-jsx`.
- The `"include"` field covers `"src"` and the `images.d.ts` type declaration file.
- **If you add a new test file, you need to restart `TypeScripter` before running tests to apply the configs in`tsconfig.app.json`.**
  If you are using IntelliJ IDEA, press `command` + `,` + `+` to call the menu, restart `TypeScripter`, and then apply it to the entire software.



---


### Start testing

#### set up the environment

set up Node.js, recommend version 16: `nvm install 16`,`nvm use 16`.

set up dependencies: `npm install` or `npm ci`.If you fail to run the test at the first time, try ` rm -rf node_modules package-lock.json`,then
`npm install`.


To run a single test file:
`npx jest src/tests/unit_tests/WelcomePage.test.tsx --runInBand --verbose`


To run all tests all together:
`npx jest` , or try `npx jest --runInBand --verbose` to get more details.

Whether you are running a single test or all tests together, we recommend first running `test_dummy.test.tsx` to ensure your environment is configured correctly.
Additionally, it is recommended to regularly clear the cache during testing by running `npx jest --clearCache`——sometimes, unexpected test failures are caused by unrefreshed cache.


You may notice that we have a `_snapshots_` folder. After running specific tests involving image file rendering, `_snapshots_` will be updated.
This is because, during testing, Jest compares the component’s rendered output with the snapshot file. If the rendered output changes, the test will fail, indicating a mismatch with the snapshot.
In general, we do not need to delete _snapshots_.

Please note that if it becomes too large and cluttered, it should be cleaned up in time.


---

### FAQ

**1.`TextEncoder` /`TextDecoder` errors?**
- Make sure to explicitly import `TextEncoder` and `TextDecoder` from the `util` module in your `jest.setup.ts` file.

**2. Newly created test files are not recognized and throw a project-error?**
- Restart the TypeScript service in IntelliJ to ensure that `tsconfig.app.json` is correctly applied. Details are explained earlier in this document.

**3. Cannot find module ... errors?**
- This is usually caused by a missing or incorrectly installed node_modules folder, or inconsistent dependency versions. We recommend deleting the existing node_modules directory and running npm install again from the docs/ directory.

**4. Cannot find test or module errors?**
- This is often due to `Node.js` or `npm` version mismatch, causing path resolution failures. 
- Check your current version using `nvm`, and ensure it matches the version specified in `.nvmrc`.

**5. Your test suite must contain at least one test or No tests found errors?**
- PowerShell (the Windows command line, and the default terminal in some VS Code setups) does not support the backslash `\` as a path separator—you must use `/` or escape it as `\\`. Pasting a file path directly into a command to test can also produce errors like above.







