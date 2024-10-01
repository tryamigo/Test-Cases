
import { test, expect } from '@playwright/test';

test.describe('Custom Authentication', () => {
  // test.beforeEach(async ({ page }) => {
  //   // Navigate to the sign-in page before each test
  //   await page.goto('/sign-in'); // Adjust the path according to your app
  // });

  test('1.User can register', async ({ page }) => {

    await page.goto('/sign-in')
    // Click the link to switch to registration
    await page.click('text=Don\'t have an account? Register');

    // Fill in registration details
    await page.fill('input#email', 'testuser@example5.com');
    await page.fill('input#password', 'password123');
    await page.fill('input#confirmPassword', 'password123');

    // Submit the registration form
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/'); // Adjust this to the expected URL after registration
    await expect(page.locator('text=Clients')).toBeVisible(); // Adjust to the appropriate success message
  });

  test('2.User can log in', async ({ page }) => {
    await page.goto('/sign-in'); 
    // Fill in login details
    await page.fill('input#email', 'testuser@example5.com'); // Use the same email as registered
    await page.fill('input#password', 'password123');

    // Submit the login form
    await page.click('button[type="submit"]');

    // Expect successful login
    await expect(page).toHaveURL('/'); // Adjust this to the expected URL after login
    await expect(page.locator('text=Clients')).toBeVisible(); // Adjust to the appropriate 


  });

  test('3.Shows error message for incorrect login password', async ({ page }) => {
  
    await page.goto('/sign-in')
    // Fill in incorrect login details
    await page.fill('input#email', 'testuser@example5.com');
    await page.fill('input#password', 'wrongpassword');

    // Submit the login form
    await page.click('button[type="submit"]');

    // Expect an error message
     await expect(page.locator('text=Invalid password')).toBeVisible(); // Adjust to your error message
  });


  test('4.Shows error message for incorrect login email', async ({ page }) => {
 
    await page.goto('/sign-in')
    // Fill in incorrect login details
    await page.fill('input#email', 'testuser@example6.com');
    await page.fill('input#password', 'wrongpassword');

    // Submit the login form
    await page.click('button[type="submit"]');

    await expect(page.locator('text=No user found with this email')).toBeVisible(); 
  });

  test('5.logout',async({page})=>{

    await page.goto('/sign-in'); 
    // Fill in login details
    await page.fill('input#email', 'testuser@example5.com'); // Use the same email as registered
    await page.fill('input#password', 'password123');

    // Submit the login form
    await page.click('button[type="submit"]');

    // Expect successful login
    await expect(page).toHaveURL('/'); // Adjust this to the expected URL after login
    await expect(page.locator('text=Clients')).toBeVisible(); // Adjust to the appropriate 

   // Click on the Demo Team button to open the dropdown
   await page.click('text=Demo Team'); // Adjust to match the button text or selector

   // Wait for the dropdown to be visible
   const dropdown = page.locator('text=Logout'); // Adjust to target the Logout button within the dropdown
   await expect(dropdown).toBeVisible();
 
   // Click the Logout button
   await dropdown.click();
 
   // Verify that the user is logged out by checking the URL or visible elements
   await expect(page).toHaveURL('/'); 
   await expect(page.locator('text=Sign In')).toBeVisible(); 
  

  })

  test('6.duplicate email  while registering',async({page})=>{
    await page.goto('/sign-in');
    await page.click('text=Don\'t have an account? Register');
    
    await page.fill('input#email', 'testuser@example5.com');
    await page.fill('input#password', 'password123');
    await page.fill('input#confirmPassword', 'password123');

    await page.click('button[type="submit"]')
    await expect(page.locator('text=User already exists')).toBeVisible();


  })
});

test.describe.only('Google Authentication', () => {

  test('1.User is redirected to Google sign-in page', async ({ page }) => {
    await page.goto('/sign-in');
  
    // Click the "Sign in with Google" button
    await page.click('button:text("Sign in with Google")');
  
    // Wait for the Google OAuth page to load (external domain)
    await page.waitForURL('https://accounts.google.com/**'); // Adjust to match the expected URL pattern
  
    // Expect the Google sign-in page to load (ensure that the redirect works)
    expect(page.url()).toContain('accounts.google.com');
  });

  test('2.User can log in with Google via mocked response', async ({ page }) => {
    await page.goto('/sign-in');
  
    // Mock the OAuth token and user data
    await page.route('https://accounts.google.com/*', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ token: 'fake-google-token' }),
      });
    });
  
    // Click the "Sign in with Google" button
    await page.click('button:text("Sign in with Google")');
  
    // Simulate successful Google login
    await page.waitForURL('/'); 
  
    // Check if login was successful
    await expect(page.locator('text=Clients')).toBeVisible(); // Adjust to the actual post-login content
  });

  test('3.Google authentication failure', async ({ page }) => {
    await page.goto('/sign-in');
  
    // Simulate the user denying Google sign-in by intercepting the request
    await page.route('https://accounts.google.com/*', (route) => {
      route.fulfill({
        status: 401,
        body: JSON.stringify({ error: 'access_denied' }),
      });
    });
  
    // Click the "Sign in with Google" button
    await page.click('button:text("Sign in with Google")');
  
    // Expect to see an error message
    await expect(page.locator('text=Google sign-in failed')).toBeVisible(); // Adjust to your actual error handling
  });

  test('4.User can log out after Google sign-in', async ({ page }) => {
    // Simulate login via Google
    await page.goto('/sign-in');
    await page.route('https://accounts.google.com/*', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ token: 'fake-google-token' }),
      });
    });
    await page.click('button:text("Sign in with Google")');
    await page.waitForURL('/'); // Post-login URL
  
    // Check if login was successful
    await expect(page.locator('text=Clients')).toBeVisible();
  
    // Now simulate logout
    await page.click('text=Demo Team'); // Adjust the selector for the dropdown
    await page.click('text=Logout');
    
    // Verify the user is logged out
    await expect(page.locator('text=Sign In')).toBeVisible();
    await expect(page).toHaveURL('/sign-in');
  });

  test('5.Google sign-in button is visible', async ({ page }) => {
    await page.goto('/sign-in');
  
    // Check that the "Sign in with Google" button is visible
    const googleButton = page.locator('button:text("Sign in with Google")');
    await expect(googleButton).toBeVisible();
    
    // Ensure the button is enabled
    await expect(googleButton).toBeEnabled();
  });
  


})



