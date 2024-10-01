
# Tests Directory

This directory contains all the end-to-end (E2E) tests for the application, written using Playwright. The tests are designed to verify that core user interactions are functioning correctly and provide confidence that the system behaves as expected.

## Folder Contents

The `/tests` directory currently contains the following test files:

### 1. `credentials-auth.spec.ts`

- **Description**: 
  - This file includes tests related to user authentication.
  - It tests the various authentication functionalities such as user registration, login, incorrect password handling, and logout.
  
- **Key Test Cases**:
  - **User Registration**: Verifies that a new user can successfully register.
  - **User Login**: Ensures that an existing user can log in with correct credentials.
  - **Incorrect Password Handling**: Displays the correct error message when an invalid password is used.
  - **Duplicate Email Registration**: Validates that an error message is shown when attempting to register with an already existing email.
  - **Logout Functionality**: Tests that a user can successfully log out.

### 2. `client.spec.ts`

- **Description**:
  - This file contains tests related to client management features.
  - It verifies that clients can be added, viewed, edited, and deleted properly.

- **Key Test Cases**:
  - **Add New Client**: Verifies the ability to add a new client with valid details.
  - **Edit Client Information**: Checks if the user can edit client details.
  - **View Client List**: Ensures that all added clients are displayed correctly.
  - **Delete Client**: Tests the deletion of an existing client from the list.

## Running Tests

To execute the tests, navigate to the root directory of the application and run the following command:

```sh
npx playwright test
