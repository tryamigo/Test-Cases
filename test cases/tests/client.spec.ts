// This file contains Playwright test scripts for testing various functionalities of the Client Management system.
// It covers login, client addition, client interaction, client group management, and communication options in multiple scenarios.

import { test, expect } from "@playwright/test";

// Test suite for Client Management functionality
test.describe("Client Management", () => {
  // Executed before each test in this suite to log in and navigate to the clients page
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in"); // Navigate to the sign-in page
    await page.fill("input#email", "testuser@example5.com"); // Input the email address
    await page.fill("input#password", "password123"); // Input the password
    await page.click('button[type="submit"]'); // Click the submit button to log in
    await expect(page).toHaveURL("/"); // Verify the correct URL after login
    await expect(page.locator("text=Clients")).toBeVisible(); // Verify that the Clients section is visible
    await page.goto("/clients"); // Navigate to the clients page
  });

  test("Add a new client with valid information", async ({ page }) => {
    // Test to add a new client with valid details
    await page.click('button:has-text("ADD NEW CLIENT")'); // Click the button to add a new client
    await page.fill("input#name", "John Doe"); // Fill in the client's name
    await page.fill("input#email", "john.doe@example.com"); // Fill in the client's email
    await page.fill("input#mobile", "1234567890"); // Fill in the client's mobile number
    await page.fill("input#whatsapp", "1234567890"); // Fill in the client's WhatsApp number
    await page.click('button:has-text("Add Client")'); // Click to add the client
    await expect(page.locator("text=John Doe")).toBeVisible(); // Verify that the new client is displayed
  });

  test("Add a client with missing required fields", async ({ page }) => {
    // Test to verify that client addition fails when required fields are missing
    await page.click('button:has-text("ADD NEW CLIENT")'); // Click the button to add a new client
    await page.click('button:has-text("Add Client")'); // Click to add the client without filling any fields
    await expect(page.locator("text=Name is required")).toBeVisible(); // Verify the error message for missing name
  });

  test("Add a client with invalid field", async ({ page }) => {
    // Test to verify error handling when an invalid email is provided
    await page.click('button:has-text("ADD NEW CLIENT")'); // Click the button to add a new client
    await page.fill("input#name", "Jane Doe"); // Fill in the client's name
    await page.fill("input#email", "invalid-email"); // Fill in an invalid email
    await page.click('button:has-text("Add Client")'); // Click to add the client
    await expect(page.locator("text=Error adding client to database")).toBeVisible(); // Verify the error message
  });
});

// Test suite for verifying Client List View functionality
test.describe("Client List View", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in"); // Log in and navigate to the clients page
    await page.fill("input#email", "testuser@example5.com");
    await page.fill("input#password", "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/");
    await expect(page.locator("text=Clients")).toBeVisible();
    await page.goto("/clients");
  });

  test("Verify all added clients are displayed", async ({ page }) => {
    // Verify that a specific client (John Doe) is displayed in the client list
    await expect(page.locator("text=John Doe")).toBeVisible(); // Verify the presence of John Doe in the client list
  });

  test("Test the search functionality", async ({ page }) => {
    // Test the search feature for clients
    await page.fill('input[placeholder="Search Clients"]', "John"); // Search for "John"
    await expect(page.locator("text=John Doe")).toBeVisible(); // Verify that John Doe is displayed in search results
  });
});

// Test suite for verifying Individual Client Page functionality
test.describe("Individual Client Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in"); // Log in and navigate to the clients page
    await page.fill("input#email", "testuser@example5.com");
    await page.fill("input#password", "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/");
    await expect(page.locator("text=Clients")).toBeVisible();
    await page.goto("/clients");
  });

  test("Navigate to a specific client's page", async ({ page }) => {
    // Test navigation to an individual client's page
    await page.click("text=John Doe"); // Click on "John Doe" to navigate to their details page
    await expect(page.locator("text=Client Info")).toBeVisible(); // Verify that the client info is visible
  });

  test("Edit client details", async ({ page }) => {
    // Test editing a client's details
    await page.click("text=John Doe"); // Open John Doe's client page
    await page.click("text=Options"); // Click on "Options" to open the edit menu
    await page.click("text=Edit Contact Details"); // Select "Edit Contact Details"
    await page.fill("input#email", "newemail@test123.com"); // Update the client's email
    await page.click('button:has-text("Save")'); // Save changes
    await expect(page.locator("text=newemail@test123.com")).toBeVisible(); // Verify the updated email is visible
  });

  test("Change client status", async ({ page }) => {
    // Test changing the client's status
    await page.click("text=John Doe"); // Open John Doe's client page
    await expect(page).toHaveURL(/.*clients\/.*/); // Verify the URL
    await expect(page.locator("text=contacted")).toBeVisible(); // Verify "contacted" status is visible
    await page.click("text=contacted"); // Click to change status
    await page.click("text=Qualified"); // Change status to "Qualified"
    await expect(page.locator("text=Qualified")).toBeVisible(); // Verify the new status is visible
  });

  test("Set follow-up date", async ({ page }) => {
    // Test setting a follow-up date for a client
    await page.click("text=John Doe"); // Open John Doe's client page
    await expect(page).toHaveURL(/.*clients\/.*/);
    await expect(page.locator("text=Follow Up:")).toBeVisible(); // Verify "Follow Up:" is visible
    await page.click("text=Follow Up:"); // Click to set a follow-up date
    await page.click("text=13"); // Select the 13th of the month
    await page.click("text=Apply"); // Apply the follow-up date
    await expect(page.locator("text= Follow Up: 13 Oct")).toBeVisible(); // Verify the new follow-up date
  });
});

// Test suite for verifying Communication Options functionality
test.describe("Communication Options", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in"); // Log in and navigate to the clients page
    await page.fill("input#email", "testuser@example5.com");
    await page.fill("input#password", "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/");
    await expect(page.locator("text=Clients")).toBeVisible();
    await page.goto("/clients");
  });

  test("Add activity to timeline", async ({ page }) => {
    // Test adding an activity to a client's timeline
    await page.click("text=John Doe"); // Open John Doe's client page
    await page.click("text=Add Activity"); // Click to add an activity
    await page.selectOption('select:near(:text("Activity Type"))', "Meeting"); // Select "Meeting" as activity type
    await page.fill(
      'textarea:near(:text("Description"))',
      "Client meeting to discuss project details"
    ); // Fill in activity description
    await page.click("text=Add Activity"); // Click to add the activity
    await expect(page.locator("text=Meeting")).toBeVisible(); // Verify the activity type is displayed
    await expect(
      page.locator("text=Client meeting to discuss project details")
    ).toBeVisible(); // Verify the activity description is displayed
  });

  test("Verify communication icons are clickable", async ({ page }) => {
    // Test that the communication icons (phone, WhatsApp, email) are clickable
    await page.click("text=John Doe"); // Open John Doe's client page
    await expect(page.locator('a[href^="tel:"]')).toBeVisible(); // Verify that the phone link is visible
    await expect(page.locator('a[href^="https://wa.me/"]')).toBeVisible(); // Verify that the WhatsApp link is visible
    await expect(page.locator('a[href^="mailto:"]')).toBeVisible(); // Verify that the email link is visible
  });
});

// Test suite for verifying Client Grouping functionality
test.describe("Client Grouping", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in"); // Log in and navigate to the clients page
    await page.fill("input#email", "testuser@example5.com");
    await page.fill("input#password", "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/");
    await expect(page.locator("text=Clients")).toBeVisible();
    await page.goto("/clients");
  });

  test("Add client to a group", async ({ page }) => {
    // Test adding a client to a group
    await page.click("text=John Doe"); // Open John Doe's client page
    await page.waitForSelector("text=Click to add groups", { state: "visible" }); // Wait for the group link to be visible
    await page.click("text=Click to add groups"); // Click to add groups
    await page.waitForSelector("text=create new group", { state: "visible" }); // Wait for the "create new group" link
    await page.click("text=create new group"); // Click to create a new group
    await page.fill("input#groupName", "VIP Clients"); // Fill in the group name
    await page.click("text=Create Group"); // Create the group
    await page.waitForSelector("text=VIP Clients", { state: "visible" }); // Wait for the group to be displayed
    await expect(page.locator("text=VIP Clients")).toBeVisible(); // Verify that the group is displayed
  });
});

// Test suite for verifying Client Notes functionality
test.describe("Client Notes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in"); // Log in and navigate to the clients page
    await page.fill("input#email", "testuser@example5.com");
    await page.fill("input#password", "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/");
    await expect(page.locator("text=Clients")).toBeVisible();
    await page.goto("/clients");
  });

  test("Add and verify note", async ({ page }) => {
    // Test adding a note to a client
    await page.click("text=John Doe"); // Open John Doe's client page
    await page.click("text=Options"); // Click on "Options"
    await page.click("text=Edit Client Notes"); // Select "Edit Client Notes"
    await page.fill("textarea.w-full", "This is a test note"); // Fill in the note
    await page.click('button:has-text("Save")'); // Save the note
    await expect(
      page.locator("p").filter({ hasText: "This is a test note" })
    ).toBeVisible(); // Verify the note is displayed
  });
});
