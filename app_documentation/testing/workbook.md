
## testing workbook


We spent some time on environment configuration and needed to install different dependencies for different types of files.
Additionally, we spent time resolving TextEncoder errors and version incompatibility issues.
In this workbook, we will explain how to carry out testing tasks.





---
### Environment requirements
It is recommended to use `Node.js version 20.x.` Avoid using `v16.x or v24.x` as they may cause incompatibility issues with the frontend code.
Also, ensure that your `npm` version is `>=9.x` to match the Node version.
If you are using `nvm`, make sure the same version is configured in `nvmrc`.


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
- moduleNameMapper: handles imports of static resources like jpg/png/svg


`tsconfig.json & tsconfig.app.json`
- We set `jsx` to `react-jsx`.
- The `"include"` field covers `"src"` and the `images.d.ts` type declaration file.
- **If you add a new test file, you need to restart TypeScripter in IntelliJ before running tests to apply the `tsconfig.app.json` configuration.**
  If you are using IntelliJ IDEA, press`command`+`,`+`+`to call the menu, restart TypeScripter, and then apply it to the entire software.


  

---

#### How to run tests

To run a single test file:
`npx jest src/tests/unit_tests/WelcomePage.test.tsx --runInBand --verbose`

To run all tests in one try:
`npx jest`

Whether you are running a single test or all tests together, we recommend first running `test_dummy.test.tsx` to ensure your environment is configured correctly.
Additionally, it is recommended to regularly clear the cache during testing by running `npx jest --clearCache`——sometimes, unexpected test failures are caused by unrefreshed cache.
You may notice that we have a `_snapshots_` folder. After running specific tests involving image file rendering, `_snapshots_` will be updated.
This is because, during testing, `Jest` compares the component’s rendered output with the snapshot file. If the rendered output changes, the test will fail, indicating a mismatch with the snapshot.

In general, we do not need to delete `_snapshots_`. Please note that if it becomes too large and cluttered, it should be cleaned up in time.

