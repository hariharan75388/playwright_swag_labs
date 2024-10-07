const { test, expect } = require("@playwright/test");

// below configuration file is to run the test in slowmo to view clearly on headed mode
test.use({
  launchOptions: {
    headless: false, // Run in headed mode
    slowMo: 200, // Slow down by 200 milliseconds
  },
});

// below function is to i) navigate to the login page ii) get the locators iii)clicking login button
async function login(page, username, password) {
  await page.goto("https://www.saucedemo.com/");
  await page.locator("#user-name").fill(username);
  await page.locator("#password").fill(password);
  await page.locator("#login-button").click();
}

// below reusable function is to verify the page title of thr new page
async function verifyPageNavigation(page, pageLink, titleName) {
  await page.goto(pageLink);
  await expect(page.locator(".title")).toHaveText(titleName);
}

//below function is to verify the error modules
async function errorModuleVerification(page) {
  await expect(page.locator('[data-test="error-button"]')).toBeVisible();
}

// Test suites               -- need to change into seprate file to follow page object model
//below is the test suite for valid login user
test("login valid user2", async ({ page }) => {
  await login(page, "standard_user", "secret_sauce");
  await verifyPageNavigation(
    page,
    "https://www.saucedemo.com/inventory.html",
    "Products"
  );
});

//below is the test suite for locked user
test("Negative: login locked user", async ({ page }) => {
  await login(page, "locked_out_user", "secret_sauce");
  await expect(page.locator('[data-test="error"]')).toHaveText(
    "Epic sadface: Sorry, this user has been locked out."
  );
  await errorModuleVerification(page);
});

//below is the test suite for empty username and Password
test("Negative :  user login w/o Username and Password", async ({ page }) => {
  await login(page, "", "");
  await expect(page.locator('[data-test="error"]')).toHaveText(
    "Epic sadface: Username is required"
  );
  await errorModuleVerification(page);
});

//below is the test suite for empty username and valid Password
test("Negative: User login w/o username", async ({ page }) => {
  await login(page, "", "secret_sauce");
  await expect(page.locator('[data-test="error"]')).toHaveText(
    "Epic sadface: Username is required"
  );
  await errorModuleVerification(page);
});
//below is the test suite for valid username and empty Password
test("Negative: User login w/o password", async ({ page }) => {
  await login(page, "standard_user", "");
  await expect(page.locator('[data-test="error"]')).toHaveText(
    "Epic sadface: Password is required"
  );
  await errorModuleVerification(page);
});

//below is the test suite for invalid username and valid Password
test("Negative: User login with invalid username", async ({ page }) => {
  await login(page, "invalid_user", "secret_sauce");
  await expect(page.locator('[data-test="error"]')).toHaveText(
    "Epic sadface: Username and password do not match any user in this service"
  );
  await errorModuleVerification(page);
});
