// This file contains Playwright test scripts for testing the Custom Authentication system, including registration, login, logout, and error handling.
// It also tests Google OAuth authentication, including successful login, failure scenarios, and logout.

import { test, expect } from '@playwright/test';

// Test suite for Custom Authentication
test.describe('Custom Authentication', () => {

  test('1. User can register', async ({ page }) => {
    await page.goto('/sign-in'); // Navigate to the sign-in page

    // Click the link to switch to registration form
    await page.click('text=Don\'t have an account? Register');

    // Fill in registration details
    await page.fill('input#email', 'testuser@example5.com'); // Input email address
    await page.fill('input#password', 'password123'); // Input password
    await page.fill('input#confirmPassword', 'password123'); // Confirm password

    // Submit the registration form
    await page.click('button[type="submit"]');

    // Expect a successful registration to navigate to the home page
    await expect(page).toHaveURL('/'); // Adjust this to the expected URL after registration
    await expect(page.locator('text=Clients')).toBeVisible(); // Verify that the Clients section is visible after registration
  });

  test('2. User can log in', async ({ page }) => {
    await page.goto('/sign-in'); // Navigate to the sign-in page

    // Fill in login details
    await page.fill('input#email', 'testuser@example5.com'); // Input email address
    await page.fill('input#password', 'password123'); // Input password

    // Submit the login form
    await page.click('button[type="submit"]');

    // Expect successful login
    await expect(page).toHaveURL('/'); // Verify the URL after login
    await expect(page.locator('text=Clients')).toBeVisible(); // Verify that the Clients section is visible after login
  });

  test('3. Shows error message for incorrect login password', async ({ page }) => {
    await page.goto('/sign-in'); // Navigate to the sign-in page

    // Fill in incorrect login details
    await page.fill('input#email', 'testuser@example5.com'); // Input email address
    await page.fill('input#password', 'wrongpassword'); // Input incorrect password

    // Submit the login form
    await page.click('button[type="submit"]');

    // Expect an error message for incorrect password
    await expect(page.locator('text=Invalid password')).toBeVisible(); // Verify the error message is displayed
  });

  test('4. Shows error message for incorrect login email', async ({ page }) => {
    await page.goto('/sign-in'); // Navigate to the sign-in page

    // Fill in incorrect login details
    await page.fill('input#email', 'testuser@example6.com'); // Input an unregistered email address
    await page.fill('input#password', 'wrongpassword'); // Input incorrect password

    // Submit the login form
    await page.click('button[type="submit"]');

    // Expect an error message for incorrect email
    await expect(page.locator('text=No user found with this email')).toBeVisible(); // Verify the error message is displayed
  });

  test('5. User can log out', async ({ page }) => {
    await page.goto('/sign-in'); // Navigate to the sign-in page

    // Fill in login details
    await page.fill('input#email', 'testuser@example5.com'); // Input email address
    await page.fill('input#password', 'password123'); // Input password

    // Submit the login form
    await page.click('button[type="submit"]');

    // Expect successful login
    await expect(page).toHaveURL('/'); // Verify the URL after login
    await expect(page.locator('text=Clients')).toBeVisible(); // Verify that the Clients section is visible after login

    // Log out
    await page.click('text=Demo Team'); // Click on the "Demo Team" button to open the dropdown
    const dropdown = page.locator('text=Logout'); // Select the "Logout" option from the dropdown
    await expect(dropdown).toBeVisible(); // Wait for the dropdown to be visible
    await dropdown.click(); // Click the "Logout" button

    // Verify that the user is logged out
    await expect(page).toHaveURL('/'); // Verify the URL after logout
    await expect(page.locator('text=Sign In')).toBeVisible(); // Verify that the Sign In button is visible after logout
  });

  test('6. Shows error message for duplicate email while registering', async ({ page }) => {
    await page.goto('/sign-in'); // Navigate to the sign-in page

    // Click the link to switch to registration form
    await page.click('text=Don\'t have an account? Register');

    // Fill in registration details with an already registered email
    await page.fill('input#email', 'testuser@example5.com'); // Input duplicate email address
    await page.fill('input#password', 'password123'); // Input password
    await page.fill('input#confirmPassword', 'password123'); // Confirm password

    // Submit the registration form
    await page.click('button[type="submit"]');

    // Expect an error message for duplicate email
    await expect(page.locator('text=User already exists')).toBeVisible(); // Verify the error message is displayed
  });
});

// Test suite for Google Authentication
test.describe.only('Google Authentication', () => {

  test('1. User is redirected to Google sign-in page', async ({ page }) => {
    await page.goto('/sign-in'); // Navigate to the sign-in page

    // Click the "Sign in with Google" button
    await page.click('button:text("Sign in with Google")');

    // Wait for the Google OAuth page to load (external domain)
    await page.waitForURL('https://accounts.google.com/**'); // Wait for the Google sign-in page

    // Expect the Google sign-in page to load
    expect(page.url()).toContain('accounts.google.com'); // Verify the URL contains Google OAuth
  });

  test('2. User can log in with Google via mocked response', async ({ page }) => {
    await page.goto('/sign-in'); // Navigate to the sign-in page

    // Mock the OAuth token and user data
    await page.route('https://accounts.google.com/*', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ token: 'fake-google-token' }), // Mock a successful Google login
      });
    });

    // Click the "Sign in with Google" button
    await page.click('button:text("Sign in with Google")');

    // Simulate successful Google login
    await page.waitForURL('/'); // Wait for the redirect to the home page

    // Verify successful login
    await expect(page.locator('text=Clients')).toBeVisible(); // Verify that the Clients section is visible after login
  });

  test('3. Google authentication failure', async ({ page }) => {
    await page.goto('/sign-in'); // Navigate to the sign-in page

    // Simulate the user denying Google sign-in by intercepting the request
    await page.route('https://accounts.google.com/*', (route) => {
      route.fulfill({
        status: 401,
        body: JSON.stringify({ error: 'access_denied' }), // Mock Google login failure
      });
    });

    // Click the "Sign in with Google" button
    await page.click('button:text("Sign in with Google")');

    // Expect an error message for failed Google sign-in
    await expect(page.locator('text=Google sign-in failed')).toBeVisible(); // Verify the error message is displayed
  });

  test('4. User can log out after Google sign-in', async ({ page }) => {
    // Simulate login via Google
    await page.goto('/sign-in'); // Navigate to the sign-in page
    await page.route('https://accounts.google.com/*', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ token: 'fake-google-token' }), // Mock a successful Google login
      });
    });
    await page.click('button:text("Sign in with Google")'); // Click the "Sign in with Google" button
    await page.waitForURL('/'); // Wait for redirect to home page

    // Verify successful login
    await expect(page.locator('text=Clients')).toBeVisible(); // Verify that the Clients section is visible after login

    // Log out
    await page.click('text=Demo Team'); // Click on the dropdown button
    await page.click('text=Logout'); // Click the "Logout" button

    // Verify the user is logged out
    await expect(page.locator('text=Sign In')).toBeVisible(); // Verify that the Sign In button is visible after logout
    await expect(page).toHaveURL('/sign-in'); // Verify the URL after logout
  });

  test('5. Google sign-in button is visible', async ({ page }) => {
    await page.goto('/sign-in'); // Navigate to the sign-in page

    // Verify that the "Sign in with Google" button is visible and enabled
    const googleButton = page.locator('button:text("Sign in with Google")');
    await expect(googleButton).toBeVisible(); // Verify that the button is visible
    await expect(googleButton).toBeEnabled(); // Verify that the button is enabled
  });
});
