
# My App

## Folder and File Structure

This application uses Playwright for end-to-end (E2E) testing. The following folder structure is used for organizing test files and application source code:

```sh
/my-app-root-directory
  ├── /tests                          # Folder to store all end-to-end (E2E) tests
  │     ├── credentials-auth.spec.ts  # Playwright test for authentication
  │     └── client.spec.ts            # Playwright test for client-related functionality
  ├── package.json                    # Node.js dependencies and scripts
  ├── playwright.config.ts            # Configuration file for Playwright
  └── /src                            # Your application's source code

```
Folder Descriptions:
/tests: Contains all end-to-end (E2E) test files written using Playwright. These tests help ensure that critical user flows are working as expected.

credentials-auth.spec.ts: Handles tests related to user authentication, such as registration, login, and logout.
client.spec.ts: Contains tests related to client management, including adding, editing, viewing, and deleting clients.
package.json: Defines the dependencies, scripts, and metadata for your Node.js project. This file includes scripts for running tests, building the app, and more.

playwright.config.ts: Configuration file for Playwright, used to set up base URL, test directory, retries, browser settings, and other test-related configurations.

/src: Contains the application's source code, including all components, services, and other assets.
