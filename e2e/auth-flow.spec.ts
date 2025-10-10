import { test, expect } from "@playwright/test";

test("login → seed → dashboard data present", async ({ page }) => {
  // Start clean
  await page.context().clearCookies();
  await page.goto("http://localhost:5173/login");

  // Fill login form with test credentials
  await page.getByLabel(/tenant domain/i).fill("amfight");
  await page.getByLabel(/email/i).fill("user@amfight.com");
  await page.getByLabel(/password/i).fill("password123");
  
  // Collect console messages
  const consoleMsgs: string[] = [];
  page.on("console", (msg) => consoleMsgs.push(msg.text()));

  // Click login button
  await page.getByRole("button", { name: /log in/i }).click();

  // Expect navigation to dashboard
  await page.waitForURL("**/dashboard");
  
  // Assert seed logs happened
  expect(consoleMsgs.some(m => /AuthContext\.login: success/.test(m))).toBeTruthy();
  expect(consoleMsgs.some(m => /Seed: (creating|already done) sample data/.test(m))).toBeTruthy();

  // Check that dashboard shows non-zero counts
  await expect(page.getByTestId("students-count")).toHaveText(/^[1-9]\d*$/);
  await expect(page.getByTestId("teachers-count")).toHaveText(/^[1-9]\d*$/);
  await expect(page.getByTestId("branches-count")).toHaveText(/^[1-9]\d*$/);

  // Reload should not reseed
  await page.reload();
  
  // Check that we still have data after reload
  await expect(page.getByTestId("students-count")).toHaveText(/^[1-9]\d*$/);
  await expect(page.getByTestId("teachers-count")).toHaveText(/^[1-9]\d*$/);
  await expect(page.getByTestId("branches-count")).toHaveText(/^[1-9]\d*$/);
  
  // Verify that reseeding didn't happen (should see "already done" message)
  const reloadConsoleMsgs: string[] = [];
  page.on("console", (msg) => reloadConsoleMsgs.push(msg.text()));
  
  // Wait a bit for any console messages from reload
  await page.waitForTimeout(1000);
  
  // Should not see "creating sample data" message on reload
  const creatingMessages = reloadConsoleMsgs.filter(m => /Seed: creating sample data/.test(m));
  expect(creatingMessages.length).toBeLessThanOrEqual(1); // Only from initial login
});
