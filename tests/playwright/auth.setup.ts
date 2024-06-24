import { test as setup,expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';
import login from "../../assets/json/test/login.json";
import user from "../../assets/json/test/user.json";

setup('authenticate', async ({ page }) => {
  await page.route("*/**/login/", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "POST")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(login),
        });
      }
    });
    await page.route("*/**/user/", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(user),
        });
      }
    });
  
  const promiseLoad = page.waitForEvent("load");
  await page.goto(process.env.FRONTEND_URL!);
  await promiseLoad;
  await page.waitForTimeout(15000);
  expect(page.locator("h2").locator("text=Sign In")).toBeTruthy();
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('john@782media.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('test');
  
  await page.getByRole("button", { name: "Login" }).click();
 
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('nav.overflow-x-hidden');
  const locatorText = await page.locator("body").innerText();
  expect(locatorText).toContain("Dashboard");
  await page.context().storageState({ path: authFile });
  
});
