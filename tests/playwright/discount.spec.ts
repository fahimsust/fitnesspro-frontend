import { test, expect } from "@playwright/test";
import { SUCCESS_MSG } from "../../constant/success.msg";
import { ERROR_MSG } from "../../constant/error.msg";
import discounts from "../../assets/json/test/discounts.json";
import discount from "../../assets/json/test/discount.json";
import advantage from "../../assets/json/test/advantage.json";
import distributors from "../../assets/json/test/distributors.json";
import countries from "../../assets/json/test/countries.json";
import shippingMethod from "../../assets/json/test/shippingMethod.json";
import advantageOption from "../../assets/json/test/advantage/advantageOption.json";
import productTypes from "../../assets/json/test/advantage/productTypes.json";
import rule from "../../assets/json/test/discount-rule/rule.json";
import ruleSingle from "../../assets/json/test/discount-rule/ruleSingle.json";
import ruleOption from "../../assets/json/test/discount-rule/ruleOption.json";
import sites from "../../assets/json/test/discount-rule/sites.json";
import membershipLevel from "../../assets/json/test/discount-rule/membershipLevel.json";
import availlibility from "../../assets/json/test/discount-rule/availlibility.json";
import attributeOption from "../../assets/json/test/discount-rule/attributeOption.json";
import accountTypes from "../../assets/json/test/discount-rule/accountTypes.json";
import products from "../../assets/json/test/products.json";
test.describe("Discount", () => {
  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(30000)
    await page.route(process.env.BACKEND_URL!+"/advantage-options", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(advantageOption),
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/discount/1/status", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(advantageOption),
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/product-types?**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(productTypes),
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/product?page=1**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(products),
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/shipping-methods", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(shippingMethod),
        });
      }
    })
    await page.route("*/**/countries", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(countries),
        });
      }
  })
    await page.route(process.env.BACKEND_URL!+"/distributors", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(distributors),
        });
      }
    })
     await page.route(process.env.BACKEND_URL!+"/discount?**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(discounts),
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/discount/**", async route => {
      const request = route.request();
      const method = request.method();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(discount),
      });
    })
    await page.route(process.env.BACKEND_URL!+"/discount-advantage?**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET" || method == "DELETE")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(advantage),
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/discount-advantage/**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "POST")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '{"advantage_type_id":1,"discount_id":1}',
        });
      }
      if(method == "PUT" || method == "DELETE")
      {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: '1',
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/advantage-product-type/**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "POST")
      {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: '{"producttype_id":4,"advantage_id":1,"id":3}',
        });
      }
      if(method == "DELETE")
      {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: '1',
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/advantage-product/", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "POST")
      {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: '{"product_id":7493,"advantage_id":35,"id":1551}',
        });
      }
    })

    await page.route(process.env.BACKEND_URL!+"/discount-rule?discount_id=**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(rule),
        });
      }
    })

   

    await page.route(process.env.BACKEND_URL!+"/discount-rule/**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(ruleSingle),
        });
      }
      if(method == "POST")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '{"discount_id":1,"match_anyall":0,"id":13}',
        });
      }
      if(method == "PUT")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '1',
        });
      }
      if(method == "DELETE")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '1',
        });
      }
    })

    await page.route(process.env.BACKEND_URL!+"/discount-condition-options", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(ruleOption),
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/attribute-option-search?page=1**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(attributeOption),
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/account-types?page=1**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(accountTypes),
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/product-availabilities?**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(availlibility),
        });
      }
    })

    await page.route(process.env.BACKEND_URL!+"/membership-level?page=1**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(membershipLevel),
        });
      }
    })

    await page.route(process.env.BACKEND_URL!+"/site?**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(sites),
        });
      }
    })

    await page.route(process.env.BACKEND_URL!+"/discount-match-rule/**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "PUT")
      {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: '{"id": 1,"name": "voluptas","display": "unde","match_anyall": 1,}',
        });
      }
    })
     // Using Promise.all to wait for all asynchronous operations to complete
    await Promise.all(ruleSingle.conditions.map(async condition => {
        const url = process.env.BACKEND_URL + "/discount-rule-condition/" + condition.id;
        await page.route(url, async route => {
            const request = route.request();
            const method = request.method();

            if (method === "GET") {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(condition),
                });
            }
            if (method === "DELETE" || method === "PUT") {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: '1',
                });
            }
        });
    }));

    await page.route(process.env.BACKEND_URL!+"/discount-rule-condition/", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "POST")
      {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: '{"rule_id":18,"condition_type_id":2,"id":46}',
        });
      }
      if(method == "DELETE" || method == "PUT")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '1',
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/condition-product/**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "POST")
      {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: '{"product_id":7493,"condition_id":51,"id":8}',
        });
      }
      if(method == "DELETE")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '1',
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/condition-product-type/**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "POST")
      {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: '{"condition_id":53,"producttype_id":3,"id":9}',
        });
      }
      if(method == "DELETE")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '1',
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/condition-attribute/**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "POST")
      {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: '{"attributevalue_id":4,"condition_id":54,"id":7}',
        });
      }
      if(method == "DELETE")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '1',
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/condition-account-type/**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "POST")
      {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: '{"condition_id":56,"accounttype_id":2,"id":7}',
        });
      }

      if(method == "DELETE")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '1',
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/condition-out-of-stock-status/**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "POST")
      {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: '{"outofstockstatus_id":4,"condition_id":57,"id":7}',
        });
      }
      if(method == "DELETE")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '1',
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/condition-out-of-stock-status/**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "POST")
      {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: '{"outofstockstatus_id":4,"condition_id":57,"id":7}',
        });
      }
      if(method == "DELETE")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '1',
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/condition-availability/**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "POST")
      {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: '{"availability_id":3,"condition_id":58,"id":7}',
        });
      }
      if(method == "DELETE")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '1',
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/condition-membership/**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "POST")
      {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: '{"condition_id":61,"membershiplevel_id":2,"id":7}',
        });
      }
      if(method == "DELETE")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '1',
        });
      }
    })

    await page.route(process.env.BACKEND_URL!+"/condition-site/**", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "POST")
      {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: '{"condition_id":63,"site_id":1,"id":7}',
        });
      }
      if(method == "DELETE")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '1',
        });
      }
    })

    const promiseLoad = page.waitForEvent("load");
    await page.goto(process.env.FRONTEND_URL!+"/dashboard");
    await page.waitForLoadState('networkidle');
    await promiseLoad;
    const firstMenu = await page.locator('ul[data-v-inspector="layouts/simple-menu-new.vue:44:9"]').first().locator('li').nth(1);
    await firstMenu.locator('a').click({ force: true });
    const secondMenu = await firstMenu.locator('ul').first().locator('li').nth(1)
    await secondMenu.locator('a').click({ force: true });
    await secondMenu.locator('ul').first().locator('li').first().locator('a').click({ force: true });
    await page.waitForURL('**/catalog/discounts');
    await page.waitForSelector('text=iure')
  });
  test("Lists", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(4).locator('input').click();
    await page.waitForSelector('div[class="swal2-container swal2-top-end swal2-backdrop-show"]');
    const content = await page.locator('h2#swal2-title').textContent();
    expect(content).toContain("Status Change");
  }); 
  test("Edit", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('input#name')).toHaveValue('iure');
    await expect(page.locator('input#display')).toHaveValue('ab');
    await page.locator('div[aria-label="Datepicker input"] input.dp__input_reg').first().click();
    await page.waitForSelector('div.dp__instance_calendar');
    await page.locator('input#name').click({ force: true });
    await page.getByText('Save').click({ force: true });
    await page.waitForSelector('div[class="swal2-container swal2-top-end swal2-backdrop-show"]');
    const content = await page.locator('h2#swal2-title').textContent();
    expect(content).toContain(SUCCESS_MSG.UPDATE_SUCCESS);
  }); 
  test("Advantage Add Delete", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(1).click();
    await page.waitForLoadState('networkidle');
    
    await page.locator('button:text("Delete")').first().click({ force: true });
    await page.waitForSelector('button span:text("Delete")');
    await page.locator('button span:text("Delete")').first().click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Advantage successfully archived");

    await page.waitForTimeout(700);
    const tabPanel = await page.locator('div[role="tabpanel"] div').first();
    await tabPanel.locator('select').nth(1).selectOption({ index: 1 });
    await tabPanel.locator('button:text("Add")').nth(1).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Advantage created successfully");

    await page.waitForTimeout(700);
    await page.locator('input#applyto_qty_combined').first().fill("1");
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");
    
  }); 

  test("Advantage Product Type Delete", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(1).click();
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=sed numquam');
    const productText = await page.getByRole("row").nth(1).getByRole('cell').nth(0).textContent();
    expect(productText).toContain("sed numquam");

    await page.locator('a.text-danger').first().click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Type for Advantage successfully removed");
  }); 
  test("Advantage Product Type Add", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(1).click();
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Search Products Types To Assign' }).first().click();
    await page.waitForSelector('text=sint consequatur');
    await page.locator('div[role="dialog"] table').first().getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Type Added successfully");
  }); 
  test("Advantage Product Add", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(1).click();
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Search Products To Assign' }).first().click();
    await page.waitForSelector('text=aut consequatur quia esse et');
    await page.locator('div[role="dialog"] table').first().getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Added successfully");
  }); 

  test("Advantage Types", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(1).click();
    await page.waitForLoadState('networkidle');


    await page.locator('select#applyto_qty_type').first().selectOption({index:1})
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#apply_shipping_id').first().selectOption({index:1})
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#apply_shipping_country').first().selectOption({index:1})
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#apply_shipping_distributor').first().selectOption({index:1})
    await page.waitForSelector('div#swal2-html-container'); 
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('input#amount').first().fill("1");
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#apply_shipping_id').nth(1).selectOption({index:1})
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#apply_shipping_country').nth(1).selectOption({index:1})
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#apply_shipping_distributor').nth(1).selectOption({index:1})
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#apply_shipping_id').nth(2).selectOption({index:1})
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#apply_shipping_country').nth(2).selectOption({index:1})
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#apply_shipping_distributor').nth(2).selectOption({index:1})
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('input#amount').nth(1).fill("1");
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('input#applyto_qty_combined').first().fill("2");
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#applyto_qty_type').nth(1).selectOption({index:1})
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('input#applyto_qty_combined').first().fill("2");
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#applyto_qty_type').nth(2).selectOption({index:1})
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('input#amount').nth(2).fill("1");
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('input#applyto_qty_combined').first().fill("3");
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#applyto_qty_type').nth(3).selectOption({index:1})
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('input#amount').nth(3).fill("1");
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('input#amount').nth(4).fill("1");
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('input#amount').nth(5).fill("1");
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('input#applyto_qty_combined').first().fill("5");
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#applyto_qty_type').nth(4).selectOption({index:1})
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");


    await page.waitForTimeout(700);
    await page.locator('input#amount').nth(6).fill("1");
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('input#amount').nth(7).fill("1");
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");


    await page.waitForTimeout(700);
    await page.locator('input#applyto_qty_combined').first().fill("6");
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#applyto_qty_type').nth(5).selectOption({index:1})
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");

    await page.waitForTimeout(700);
    await page.locator('input#amount').nth(8).fill("1");
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Advantage details updated successfully");
    
  }); 

  test("Rule Add Update Delete", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');
  
    await page.locator('select#match_anyall').first().selectOption({ index: 1 });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Rule Match updated successfully");

    await page.waitForTimeout(700);
    await page.getByRole('button', { name: 'Create New Rule' }).first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Rule created successfully");

    await page.waitForTimeout(700);
    await page.locator('button:text("Delete")').first().click({ force: true });
    await page.waitForSelector('button span:text("Delete")');
    await page.locator('button span:text("Delete")').first().click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Rule successfully deleted");

    await page.waitForTimeout(700);
    await page.locator('select#match_anyall').nth(1).selectOption({ index: 1 });
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Rule updated successfully");

    await page.waitForTimeout(700);
    await page.locator('input#rank').first().fill("6");
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Rule updated successfully");
  }); 

  test("Condition Add Delete Update", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');
  
    await page.locator('select#condition_type_id').first().selectOption({ index: 2 });
    await page.getByRole('button', { name: 'Create New Condition' }).first().click();
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition created successfully");  

    await page.waitForTimeout(700);
    await page.locator('button:text("Delete")').nth(1).click({ force: true });
    await page.waitForSelector('button span:text("Delete")');
    await page.locator('button span:text("Delete")').first().click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition successfully archived");

    await page.waitForTimeout(700);
    await page.locator('input#required_cart_value').first().fill("6");
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");
    
  }); 

  test("Condition Product Add", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Search Product To Assign' }).first().click();
    await page.waitForSelector('text=aut consequatur quia esse et');
    await page.locator('div[role="dialog"] table').first().getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Added successfully");
  }); 

  test("Condition Product Delete", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.locator('a.text-danger').first().click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product for Condition successfully deleted");
  }); 

  test("Condition Product Type Add", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Search Product Type To Assign' }).first().click();
    await page.waitForSelector('text=quis accusamus');
    await page.locator('div[role="dialog"] table').first().getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Type Added successfully");
  }); 

  test("Condition Product Type Delete", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.locator('a.text-danger').nth(3).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Type for Condition successfully removed");
  }); 

  test("Condition Attribute Option Add", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Search Attribute To Assign' }).first().click();
    await page.waitForSelector('text=Personal Trainer');
    await page.locator('div[role="dialog"] table').first().getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Attribute Added successfully");
  }); 

  test("Condition Attribute Option Delete", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.locator('a.text-danger').nth(5).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Attribute for Condition successfully deleted");
  }); 

  test("Condition Account Type Add", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Search Account Type To Assign' }).first().click();
    await page.waitForSelector('text=Medallion');
    await page.locator('div[role="dialog"] table').first().getByRole("row").nth(1).getByRole('cell').nth(0).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Account Type Added successfully");
  }); 

  test("Condition Account Type Delete", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.locator('a.text-danger').nth(7).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Account Type for Condition successfully deleted");
  }); 

   test("Condition Out Of Stock Status Add", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Search Out Of Stock Status To Assign' }).first().click();
    await page.waitForSelector('text=Discontinued');
    await page.locator('div[role="dialog"] table').first().getByRole("row").nth(1).getByRole('cell').nth(0).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Out of stock status Added successfully");
  }); 

  test("Condition Out Of Stock Status Delete", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.locator('a.text-danger').nth(9).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Out of stock status removed successfully");
  });

  test("Condition Availability Status Add", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Search Availability Status To Assign' }).first().click();
    await page.waitForSelector('text=Discontinued');
    await page.locator('div[role="dialog"] table').first().getByRole("row").nth(1).getByRole('cell').nth(0).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product availability status Added successfully");
  }); 

  test("Condition Out Of Availability Status Delete", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.locator('a.text-danger').nth(11).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product availability status for Condition successfully removed");
  });

  test("Condition Membership Level Add", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Search Membership Level To Assign' }).first().click();
    await page.waitForSelector('text=Enterprise');
    await page.locator('div[role="dialog"] table').first().getByRole("row").nth(1).getByRole('cell').nth(0).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Membership Level Added successfully");
  }); 

  test("Condition Membership Level Delete", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.locator('a.text-danger').nth(13).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Membership Level for Condition successfully deleted");
  });

  test("Condition Site Add", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Search Site To Assign' }).first().click();
    await page.waitForSelector('text=Mann Group');
    await page.locator('div[role="dialog"] table').first().getByRole("row").nth(1).getByRole('cell').nth(0).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Site Added successfully");
  }); 

  test("Condition Site Delete", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.locator('a.text-danger').nth(15).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Site for Condition successfully removed");
  });

   test("Condition Type One", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.locator('input#required_qty_combined').first().fill('2');
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#required_qty_type').first().selectOption({index:1});
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#equals_notequals').first().selectOption({index:1});
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");
   })

   test("Condition Type Two", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.locator('input#required_qty_combined').nth(1).fill('2');
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#required_qty_type').nth(1).selectOption({index:1});
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#equals_notequals').nth(1).selectOption({index:1});
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");
   })
   test("Condition Type Three", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.locator('input#required_qty_combined').nth(2).fill('2');
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#required_qty_type').nth(2).selectOption({index:1});
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#equals_notequals').nth(2).selectOption({index:1});
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");
   })
   test("Condition Type Four", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.locator('input#required_qty_combined').nth(3).fill('2');
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#required_qty_type').nth(3).selectOption({index:1});
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#equals_notequals').nth(3).selectOption({index:1});
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");
   })
   test("Condition Type Five", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.locator('input#required_qty_combined').nth(4).fill('2');
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#required_qty_type').nth(4).selectOption({index:1});
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");

    await page.waitForTimeout(700);
    await page.locator('select#equals_notequals').nth(4).selectOption({index:1});
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");
   })

  test("Condition Type Six", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.locator('input#required_code').first().fill('10');
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");
  });

  test("Condition Type Seven", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.locator('input#required_code').nth(1).fill('10');
    await page.keyboard.press('Enter');
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");
  });

  test("Condition Type Eight", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.waitForSelector('input#use_with_rules_products');
    await page.locator('input#use_with_rules_products').first().click();
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");
  });

  test("Condition Type Nine", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForURL('**/catalog/discounts/1');
    await page.waitForLoadState('networkidle');

    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.waitForLoadState('networkidle');

    await page.waitForSelector('input.dp__input');

    await page.locator('input.dp__input').first().click();
    await page.locator('div.dp__calendar_row').first().locator('div.dp__calendar_item').nth(6).click();

    await page.locator('input.dp__input').nth(1).click();
    await page.locator('div.dp__calendar_row').nth(1).locator('div.dp__calendar_item').nth(6).click();
    

    await page.getByRole('button', { name: 'Save' }).first().click();
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Discount Condition updated successfully");
  });
});
