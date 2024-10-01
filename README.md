https://github.com/tryamigo/Test-Cases.git

# Playwright Testing Setup

This repository contains automated tests using [Playwright](https://playwright.dev/), a powerful end-to-end testing framework for web applications.

## Prerequisites

Before getting started, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v12 or higher)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js) or [yarn](https://classic.yarnpkg.com/en/docs/install/)

## Installation

To install Playwright and set up the project, follow these steps:

##Important Note

The tests folder must be present in the root folder of your application, and it must contain the playwright.config.ts file.
This is crucial for Playwright to properly locate and execute your test files with the correct configuration settings.

1. **Clone the Repository and install modules**:

   ```sh
   git clone https://github.com/your-username/your-repository.git
   npm install

2. **Install Playwright**:

   ```sh
   npx playwright install

3. **Run Playwright**:

   ```sh
   npx playwright test

4. **For Particular file**:

   ```sh
   npx playwright test path/to/your-test-file.spec.ts
5. **For accessing the UI of playwright**:

   ```sh
   npx playwright test --ui
