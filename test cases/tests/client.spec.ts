import { test, expect } from "@playwright/test";

test.describe("Client Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in");
    // Fill in login details
    await page.fill("input#email", "testuser@example5.com"); // Use the same email as registered
    await page.fill("input#password", "password123");

    // Submit the login form
    await page.click('button[type="submit"]');

    // Expect successful login
    await expect(page).toHaveURL("/"); // Adjust this to the expected URL after login
    await expect(page.locator("text=Clients")).toBeVisible(); // Adjust to the appropriate
    // Navigate to the clients page
    await page.goto("/clients");
  });

  test("Add a new client with valid information", async ({ page }) => {
    await page.click('button:has-text("ADD NEW CLIENT")');
    await page.fill("input#name", "John Doe");
    await page.fill("input#email", "john.doe@example.com");
    await page.fill("input#mobile", "1234567890");
    await page.fill("input#whatsapp", "1234567890");
    await page.click('button:has-text("Add Client")');

    await expect(page.locator("text=John Doe")).toBeVisible();
  });

  test("Add a client with missing required fields", async ({ page }) => {
    await page.click('button:has-text("ADD NEW CLIENT")');
    // Don't fill in any fields
    await page.click('button:has-text("Add Client")');

    await expect(page.locator("text=Name is required")).toBeVisible();
  });

  test("Add a client with invalid field", async ({ page }) => {
    await page.click('button:has-text("ADD NEW CLIENT")');
    await page.fill("input#name", "Jane Doe");
    await page.fill("input#email", "invalid-email");
    await page.click('button:has-text("Add Client")');

    await expect(
      page.locator("text=Error adding client to database")
    ).toBeVisible();
  });
});

test.describe("Client List View", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in");
    // Fill in login details
    await page.fill("input#email", "testuser@example5.com"); // Use the same email as registered
    await page.fill("input#password", "password123");

    // Submit the login form
    await page.click('button[type="submit"]');

    // Expect successful login
    await expect(page).toHaveURL("/"); // Adjust this to the expected URL after login
    await expect(page.locator("text=Clients")).toBeVisible(); // Adjust to the appropriate
    // Navigate to the clients page
    await page.goto("/clients");
  });
  test("Verify all added clients are displayed", async ({ page }) => {
    const clientNames = "John Doe";

    await expect(page.locator(`text=${clientNames}`)).toBeVisible();
  });

  test("Test the search functionality", async ({ page }) => {
    await page.fill('input[placeholder="Search Clients"]', "John");
    await expect(page.locator("text=John Doe")).toBeVisible();
  });
});

test.describe("Individual Client Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in");
    // Fill in login details
    await page.fill("input#email", "testuser@example5.com"); // Use the same email as registered
    await page.fill("input#password", "password123");

    // Submit the login form
    await page.click('button[type="submit"]');

    // Expect successful login
    await expect(page).toHaveURL("/"); // Adjust this to the expected URL after login
    await expect(page.locator("text=Clients")).toBeVisible(); // Adjust to the appropriate
    // Navigate to the clients page
    await page.goto("/clients");
  });

  test("Navigate to a specific client's page", async ({ page }) => {
    await page.click("text=John Doe");
    await expect(page.locator("text=Client Info")).toBeVisible();
  });

  test("Edit client details", async ({ page }) => {
    await page.click("text=John Doe");
    await page.click("text=Options");
    await page.click("text=Edit Contact Details");
    await page.fill("input#email", "newemail@test123.com");
    await page.click('button:has-text("Save")');
    await expect(page.locator("text=newemail@test123.com")).toBeVisible();
  });

  test("Change client status", async ({ page }) => {
    await page.click("text=John Doe");
    await expect(page).toHaveURL(/.*clients\/.*/);
    await expect(page.locator("text=contacted")).toBeVisible();
    await page.click("text=contacted");
    await page.click("text=Qualified");
    await expect(page.locator("text=Qualified")).toBeVisible();
  });

  test("Set follow-up date", async ({ page }) => {
    await page.click("text=John Doe");
    await expect(page).toHaveURL(/.*clients\/.*/);

    // Check for the "No follow up" text initially
    // await expect(page.locator('text= No follow up Scheduled')).toBeVisible();
    await expect(page.locator("text= Follow Up:")).toBeVisible();

    // // Schedule a follow-up date
    //  await page.click('text= No follow up Scheduled');
    await page.click("text= Follow Up:");

    await page.click("text=13");
    await page.click("text=Apply");

    // Now the text should be "Follow Up" instead of "No follow up"
    await expect(page.locator("text= Follow Up: 13 Oct")).toBeVisible();
  });
});

test.describe("Communication Options", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in");
    // Fill in login details
    await page.fill("input#email", "testuser@example5.com"); // Use the same email as registered
    await page.fill("input#password", "password123");

    // Submit the login form
    await page.click('button[type="submit"]');

    // Expect successful login
    await expect(page).toHaveURL("/"); // Adjust this to the expected URL after login
    await expect(page.locator("text=Clients")).toBeVisible(); // Adjust to the appropriate
    // Navigate to the clients page
    await page.goto("/clients");
  });

  /*  */
  test("Add activity to timeline", async ({ page }) => {
    await page.click("text=John Doe");
    await expect(page).toHaveURL(/.*clients\/.*/);

    await page.click("text=Add Activity");

    await page.selectOption('select:near(:text("Activity Type"))', "Meeting");

    await page.fill(
      'textarea:near(:text("Description"))',
      "Client meeting to discuss project details"
    );
    
    
    
    await page.click('text=Add Activity')
    // Verify that the new activity appears in the timeline
    await expect(page.locator("text=Meeting")).toBeVisible();
    await expect(
      page.locator("text=Client meeting to discuss project details")
    ).toBeVisible();
  });

  test("Verify communication icons are clickable", async ({ page }) => {
    await page.click("text=John Doe");
    await expect(page.locator('a[href^="tel:"]')).toBeVisible();
    await expect(page.locator('a[href^="https://wa.me/"]')).toBeVisible();
    await expect(page.locator('a[href^="mailto:"]')).toBeVisible();
  });
});

test.describe("Client Grouping", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in");
    // Fill in login details
    await page.fill("input#email", "testuser@example5.com"); // Use the same email as registered
    await page.fill("input#password", "password123");

    // Submit the login form
    await page.click('button[type="submit"]');

    // Expect successful login
    await expect(page).toHaveURL("/"); // Adjust this to the expected URL after login
    await expect(page.locator("text=Clients")).toBeVisible(); // Adjust to the appropriate
    // Navigate to the clients page
    await page.goto("/clients");
  });
  test("Add client to a group", async ({ page }) => {
    // Click on client name to open the details
    await page.click("text=John Doe");
    await page.waitForSelector("text=Click to add groups", {
      state: "visible",
    }); // Wait for the "Click to add groups" link

    // Click to add groups
    await page.click("text=Click to add groups");

    // Wait for and click "create new group"
    await page.waitForSelector("text=create new group", { state: "visible" });
    await page.click("text=create new group");

    await page.fill("input#groupName", "VIP Clients");
    await page.click("text=Create Group");

    // Verify that the group was added (e.g., check for "VIP Clients")
    await page.waitForSelector("text=VIP Clients", { state: "visible" }); // Wait for the group to be displayed
    await expect(page.locator("text=VIP Clients")).toBeVisible();
  });
});

test.describe("Client Notes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in");
    // Fill in login details
    await page.fill("input#email", "testuser@example5.com"); // Use the same email as registered
    await page.fill("input#password", "password123");

    // Submit the login form
    await page.click('button[type="submit"]');

    // Expect successful login
    await expect(page).toHaveURL("/"); // Adjust this to the expected URL after login
    await expect(page.locator("text=Clients")).toBeVisible(); // Adjust to the appropriate
    // Navigate to the clients page
    await page.goto("/clients");
  });

  test("Add and verify note", async ({ page }) => {
    await page.click("text=John Doe");
    await expect(page).toHaveURL(/.*clients\/.*/);
    await page.click("text=Options");
    await page.click("text=Edit Client Notes");
    await page.fill("textarea.w-full", "This is a test note");
    await page.click('button:has-text("Save")');
    await expect(
      page.locator("p").filter({ hasText: "This is a test note" })
    ).toBeVisible();
  });
});
