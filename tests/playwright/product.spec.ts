import { test, expect } from "@playwright/test";
import { SUCCESS_MSG } from "../../constant/success.msg";
import { ERROR_MSG } from "../../constant/error.msg";
import products from "../../assets/json/test/products.json";
import product from "../../assets/json/test/product.json";
import brands from "../../assets/json/test/brands.json";
import categories from "../../assets/json/test/categories.json";
import languages from "../../assets/json/test/languages.json";
import productType from "../../assets/json/test/productType.json";
import attributes from "../../assets/json/test/product/attributes.json";
import images from "../../assets/json/test/product/images.json";
import productImages from "../../assets/json/test/product/productImages.json";
import productOption from "../../assets/json/test/product/productOption.json";
import productOptionValues from "../../assets/json/test/product/productOptionValues.json";
import pricing from "../../assets/json/test/product/pricing.json";
import pricings from "../../assets/json/test/product/pricings.json";
import productVariants from "../../assets/json/test/product/productVariants.json";
import variantSummary from "../../assets/json/test/product/variantSummary.json";
import accessory from "../../assets/json/test/product/accessory.json";
import accessoryField from "../../assets/json/test/product/accessoryField.json";
import accessoryFields from "../../assets/json/test/product/accessoryFields.json";
import productAwaiting from "../../assets/json/test/product/productAwaiting.json";
import productForms from "../../assets/json/test/product/productForms.json";
import related  from "../../assets/json/test/product/related.json";
import productModuleSection  from "../../assets/json/test/product/productModuleSection.json";
import productSettingTemplate  from "../../assets/json/test/product/productSettingTemplate.json";
import sitSettings  from "../../assets/json/test/product/sitSettings.json";
import productModuleValue  from "../../assets/json/test/product/productModuleValue.json";
import pricingRules from "../../assets/json/test/pricingRules.json";
import orderingRules from "../../assets/json/test/orderingRules.json";
import distributors from "../../assets/json/test/distributors.json";
import availlibility from "../../assets/json/test/discount-rule/availlibility.json";
import sites from "../../assets/json/test/sites.json";
import fullfillments from "../../assets/json/test/fullfillments.json";
import customForms from "../../assets/json/test/customForms.json";

import detailTemplate from "../../assets/json/test/template/detailTemplate.json";
import thumbnailTemplate from "../../assets/json/test/template/thumbnailTemplate.json";
import layouts from "../../assets/json/test/template/layouts.json";
import moduleTemplate from "../../assets/json/test/template/moduleTemplate.json";
import zoomTemplate from "../../assets/json/test/template/zoomTemplate.json";

test.describe("Product", () => {
  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(30000)
    await page.route(process.env.BACKEND_URL!+"/brand", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(brands),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/category", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(categories),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/product?page=1**", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(products),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/product-images?page=1**", async route => {
      const request = route.request();
      const method = request.method();
      
      if (method == "GET") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(productImages),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/product/**", async route => {
      const request = route.request();
      const method = request.method();
      const url = request.url();
      
      if (method === "GET" || method === "PUT" || method === "POST" || method === "DELETE") {
        let responseBody;
    
        if (url.includes("product-variant-summary")) {
          responseBody = JSON.stringify(variantSummary);
        }
        else if (url.includes("site-setting")) {
          responseBody = JSON.stringify(sitSettings);
        }
        else if (url.includes("form")) {
          responseBody = JSON.stringify(productForms);
        }
        else if (url.includes("related")) {
          responseBody = JSON.stringify(related);
        }
        else if (url.includes("accessory-field")) {
          responseBody = JSON.stringify(accessoryField);
        }
        else if (url.includes("accessory")) {
          responseBody = JSON.stringify(accessory);
        }
        else if (url.includes("product-awaiting-variant")) {
          responseBody = JSON.stringify(productAwaiting);
        }
        else if (url.includes("product-variant")) {
          responseBody = JSON.stringify(productVariants);
        }
        else if (url.includes("pricings")) {
          responseBody = JSON.stringify(pricings);
        }
        else if (url.includes("pricing")) {
          responseBody = JSON.stringify(pricing);
        }
        else if (url.includes("image")) {
          // Handle image response
          responseBody = JSON.stringify(images);
        } else {
          // Handle product response
          responseBody = JSON.stringify(product);
        }
    
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: responseBody,
        });
      }
    });
    

    await page.route(process.env.BACKEND_URL!+"/product-type", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(productType),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/product-attribute?product_id=**", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(attributes),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/product-option?page=**", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(productOption),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/product-option/**", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "PUT" || method == "DELETE") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '1',
        });
      }
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '',
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/product-option", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '1',
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/product-option-values/**", async route => {
      const request = route.request();
      const method = request.method();
      const url = request.url();
      if (url.includes("image")) {
        if (method == "PUT" || method == "GET") {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: '1',
          });
        }
      }
      else
      {
        if (method == "PUT" || method == "DELETE" || method == "GET" || method == "POST") {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(productOptionValues),
          });
        }
      }
      
    });
    await page.route(process.env.BACKEND_URL!+"/product-option-values", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '1',
        });
      }
    });

    await page.route(process.env.BACKEND_URL!+"/languages", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(languages),
        });
      }
    });

    await page.route(process.env.BACKEND_URL!+"/ordering-rule", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(orderingRules),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/pricing-rule", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(pricingRules),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/site", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(sites),
        });
      }
    });
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
    await page.route(process.env.BACKEND_URL!+"/product-availabilities", async route => {
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
    await page.route(process.env.BACKEND_URL!+"/ful-fillment-rules", async route => {
      const request = route.request();
      const method = request.method();
      if(method == "GET")
      {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(fullfillments),
        });
      }
    })
    await page.route(process.env.BACKEND_URL!+"/variant-bulk-update/**", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: '1',
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/accessory-fields?page=**", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(accessoryFields),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/custom-form?page=**", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(customForms),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/product-module/sections", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(productModuleSection),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/module-template", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(moduleTemplate),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/layout", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(layouts),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/product-settings-template", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(productSettingTemplate),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/display-template-zoom", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(zoomTemplate),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/display-template-detail", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(detailTemplate),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/display-template-thumbnail", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(thumbnailTemplate),
        });
      }
    });
    await page.route(process.env.BACKEND_URL!+"/product-module-value?**", async route => {
      const request = route.request();
      const method = request.method();
      if (method == "GET" || method == "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(productModuleValue),
        });
      }
    });

    
    const promiseLoad = page.waitForEvent("load");
    await page.goto(process.env.FRONTEND_URL!+"/dashboard");
    await page.waitForLoadState('networkidle');
    await promiseLoad;
    const menu = await page.locator('ul[data-v-inspector="layouts/simple-menu-new.vue:44:9"]').first().locator('li').nth(1);
    await menu.locator('a').click({ force: true });
    await menu.locator('ul').first().locator('li').first().locator('a').click({ force: true });
    await page.waitForURL('**/products');
    await page.getByRole('button', { name: 'Filter' }).first().click();
  });
  test("Lists", async ({ page }) => {
      const tableText = await page.locator('table').first().textContent();
      expect(tableText).toContain('Annual Enterprise Membership');
      expect(tableText).toContain('Annual Basic Membership');
  });
  test("Product Add", async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Product' }).first().click();
    await page.waitForSelector('text=Product Basic Information');
    await page.getByLabel('Product Title*').click();
    await page.getByLabel('Product Title*').fill("Title");
    await page.getByLabel('URL Slug*').click();
    await page.getByLabel('URL Slug*').fill("url-name");
    await page.getByRole('textbox', { name: 'Editor editing area: main' }).first().click();
    await page.keyboard.press("Meta+KeyA")
    await page.keyboard.type('Description');
    await page.getByRole('paragraph').nth(1).click();
    await page.keyboard.press("Meta+KeyA")
    await page.keyboard.type('Summary');
    await page.getByLabel('Default Regular Price ($)*').click();
    await page.getByLabel('Default Regular Price ($)*').fill('100');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForSelector('div[class="swal2-container swal2-top-end swal2-backdrop-show"]');
    const content = await page.locator('h2#swal2-title').textContent();
    expect(content).toContain(SUCCESS_MSG.CREATE_SUCCESS);
  });
  test("Product Edit", async ({ page }) => {
    await page.locator('table tr:nth-child(2)').click({ force: true });
    await page.waitForURL('**/products/**');
    expect(page.url()).toContain('/products/');
    await page.waitForSelector('text=aut consequatur quia esse et')
    await page.getByLabel('Product Title*').click();
    await page.getByLabel('Product Title*').fill('title updated');
    await page.getByLabel('URL Slug*').click();
    await page.getByLabel('URL Slug*').fill('url-updated');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForSelector('div[class="swal2-container swal2-top-end swal2-backdrop-show"]');
    const content = await page.locator('h2#swal2-title').textContent();
    expect(content).toContain(SUCCESS_MSG.UPDATE_SUCCESS);

    await page.waitForTimeout(700)
    await page.locator('text=Meta').first().click();
    await page.getByLabel('Meta Title').click();
    await page.getByLabel('Meta Title').fill('Meta Title');
    await page.getByLabel('Meta Description').click();
    await page.getByLabel('Meta Description').fill('Meta Description');
    await page.getByLabel('Meta Keywords').click();
    await page.getByLabel('Meta Keywords').fill('Meta Keywords');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Meta Data updated successfully");

    await page.waitForTimeout(700)
    await page.locator('text=Customs Info').first().click();
    await page.getByLabel('Customs Description').click();
    await page.getByLabel('Customs Description').fill('Customs Description');
    await page.getByLabel('Tariff Number').click();
    await page.getByLabel('Tariff Number').fill('Tariff Number');
    await page.getByLabel('Country of Origin').click();
    await page.getByLabel('Country of Origin').fill('Country of Origin');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Custom Information updated successfully");

    await page.waitForTimeout(700)
    await page.locator('ul[role="tablist"]').first().locator('li').nth(1).click();
    await page.getByRole('textbox', { name: 'Editor editing area: main' }).first().click();
    await page.keyboard.press("Meta+KeyA")
    await page.keyboard.type('Description');
    await page.getByRole('paragraph').nth(1).click();
    await page.keyboard.press("Meta+KeyA")
    await page.keyboard.type('Summary');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product content updated successfully");

    await page.waitForTimeout(700)
    await page.locator('ul[role="tablist"]').first().locator('li').nth(2).click();
    await page.locator('div[role="combobox"]').first().click();
    await page.locator('div[data-value="8"]').first().click();
    await page.locator('div[role="combobox"]').nth(1).click();
    await page.locator('div[data-value="9"]').nth(1).click();
    await page.locator('input#downloadable').click();
    await page.locator('input#create_children_auto').click();
    await page.locator('input#display_children_grid').click();
    await page.locator('input#override_parent_description').click();
    await page.locator('input#allow_pricing_discount').click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Details updated successfully");

    await page.waitForTimeout(700)
    await page.locator('text=Add To Cart').first().click();
    await page.locator('select#addtocart_setting').selectOption({index:1});
    await page.getByRole('button', { name: 'Save' }).nth(1).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Cart Setting updated successfully");
  });
  test("Product Off", async ({ page }) => {
    await page.getByRole("row").nth(1).locator("a").click();
    await page.waitForSelector('button span:text("Archive")');
    await page.locator('button span:text("Archive")').first().click({ force: true });
    await page.waitForSelector('div[class="swal2-container swal2-top-end swal2-backdrop-show"]');
    const content = await page.locator('h2#swal2-title').textContent();
    expect(content).toContain(SUCCESS_MSG.SUCCESSFULLY_ARCHIVED);
  });
  test("Product On", async ({ page }) => {
    await page.getByRole('button', { name: 'Filter' }).click();
    await page.locator('div').filter({ hasText: /^StatusActiveArchived$/ }).getByRole('combobox').selectOption('1');
    await page.getByRole('button', { name: 'Done' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole("row").nth(1).locator("a").click();
    await page.waitForSelector('div[class="swal2-container swal2-top-end swal2-backdrop-show"]');
    const content = await page.locator('h2#swal2-title').textContent();
    expect(content).toContain("Restore Successfully");
  });
  test("Attributes", async ({ page }) => {
    await page.locator('table tr:nth-child(2)').click({ force: true });
    await page.waitForURL('**/products/**');
    expect(page.url()).toContain('/products/');
    await page.waitForSelector('text=aut consequatur quia esse et');
    await page.locator('a[href="/catalog/products/7494/attributes"]').click();
    await page.waitForSelector('text=Product Type');
    await page.locator('div[role="combobox"]').first().click();
    await page.locator('div[data-value="9"]').first().click();
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Type updated successfully");

    await page.waitForTimeout(700)
    await page.locator('div[role="combobox"]').nth(1).click();
    await page.locator('div[data-value="63"]').first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Successfully saved");

    await page.waitForTimeout(700)
    await page.locator('text=autem illum').click();
    page.on('dialog', dialog => dialog.accept());
    await page.locator('a.remove').first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Successfully saved");

    await page.waitForTimeout(700)
    await page.locator('div[role="combobox"]').nth(1).click();
    await page.locator('div[data-value="3"]').nth(1).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Successfully saved");
  });
  test("Images", async ({ page }) => {
    await page.locator('table tr:nth-child(2)').click({ force: true });
    await page.waitForURL('**/products/**');
    expect(page.url()).toContain('/products/');
    await page.waitForSelector('text=aut consequatur quia esse et');
    await page.locator('a[href="/catalog/products/7494/image"]').click();
    await page.waitForSelector('text=Product Deatils Image');
    await page.locator('select').first().selectOption({index:2});
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Deatils image Updated successfully");

    await page.waitForTimeout(700)
    await page.locator('select').nth(1).selectOption({index:2});
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Category image Updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(2)').locator('input').first().click();
    await page.locator('table tr:nth-child(2)').locator('input').first().fill('test data');
    await page.locator('table tr:nth-child(2)').locator('input').nth(1).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product image Updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(2)').locator('input').nth(1).click();
    await page.locator('table tr:nth-child(2)').locator('input').nth(1).fill('4');
    await page.locator('table tr:nth-child(2)').locator('input').first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product image Updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(2)').locator('input').nth(2).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product image Updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(2)').locator('a.text-danger').first().click();
    await page.waitForSelector('button span:text("Remove")');
    await page.locator('button span:text("Remove")').first().click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Image successfully deleted")
  });
  test("Product Options", async ({ page }) => {
    await page.locator('table tr:nth-child(2)').click({ force: true });
    await page.waitForURL('**/products/**');
    expect(page.url()).toContain('/products/');
    await page.waitForSelector('text=aut consequatur quia esse et');
    await page.locator('a[href="/catalog/products/7494/options"]').click();
    await page.waitForSelector('text=Create Product Option');

    await page.locator('table tr:nth-child(2)').locator('input').first().click();
    await page.locator('table tr:nth-child(2)').locator('input').first().fill('test data');
    await page.locator('table tr:nth-child(2)').locator('input').nth(1).click();
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Option Updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(2)').locator('input').nth(1).click();
    await page.locator('table tr:nth-child(2)').locator('input').nth(1).fill('test data');
    await page.locator('table tr:nth-child(2)').locator('input').first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Option Updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(2)').locator('input').nth(2).click();
    await page.locator('table tr:nth-child(2)').locator('input').nth(2).fill('5');
    await page.locator('table tr:nth-child(2)').locator('input').first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Option Updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(2)').locator('input').nth(3).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Option Updated successfully");

    await page.waitForTimeout(700);
    await page.getByRole("row").nth(1).locator("a").click();
    await page.waitForSelector('button span:text("Remove")');
    await page.locator('button span:text("Remove")').first().click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Option successfully deleted");

    await page.waitForTimeout(700);
    await page.getByRole('button', { name: 'Create Product Option' }).click();
    await page.waitForSelector("text=Add Product Option");
    await page.locator('input#name').fill("Name");
    await page.locator('input#display').fill("Name");
    await page.locator("select#type_id").selectOption({index:1});
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Option Added successfully");

    await page.waitForTimeout(700);
    await page.getByRole("row").nth(1).getByRole("button").nth(1).click();
    await page.waitForSelector("text=Translations");
    await page.locator('input#display').first().fill("Display");
    await page.locator('input#name').first().fill("Name");
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Option Updated successfully");

    await page.waitForTimeout(700);
    await page.locator('a.absolute').click();
    await page.getByRole("row").nth(1).getByRole("button").first().click();
    await page.waitForSelector("text=Product Option Values");
    await page.locator('text=Create Product Option Value').click();
    await page.waitForSelector("text=Add Product Option Value");
    await page.locator('input#display').fill("Name");
    await page.locator('input#rank').fill("1");
    await page.locator('input#price').fill("10");
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Option Value Added successfully");

    await page.waitForTimeout(700);
    await page.getByRole("row").nth(1).click();
    await page.waitForSelector("text=Edit:");
    await page.locator('input#name').fill("Name");
    await page.locator('input#display').fill("display");
    await page.locator('input#rank').fill("1");
    await page.locator('input#price').fill("10");
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Option Value Updated successfully");

    await page.waitForTimeout(700);
    await page.getByRole("row").nth(1).click();
    await page.waitForSelector("text=Edit:");
    await page.locator("text=French").first().click();
    await page.locator('input#name').fill("Name");
    await page.locator('input#display').fill("display");
    await page.getByRole('button', { name: 'Save' }).first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Option Value Updated successfully");

    await page.waitForTimeout(700);
    await page.locator('a.absolute').click();
    await page.locator('text=Date Range');
    await page.getByRole("row").nth(3).getByRole("button").first().click();
    await page.waitForSelector("text=Product Option Values");
    await page.locator('text=Create Product Option Value').click();
    await page.waitForSelector("text=Add Product Option Value");
    await page.locator('input.dp__input').first().click({ force: true });
    await page.locator('div.dp__calendar_row').first().locator('div.dp__calendar_item').nth(6).click({ force: true });
    await page.locator('input.dp__input').nth(1).click({ force: true });
    await page.locator('div.dp__calendar_row').nth(1).locator('div.dp__calendar_item').nth(6).click({ force: true });
    await page.locator('input#days_skip_between').fill("2");
    await page.locator('input#days_duration').fill("3");
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Option Value for date range Added successfully");
  })
  test("Product Pricings", async ({ page }) => {
    await page.locator('table tr:nth-child(2)').click({ force: true });
    await page.waitForURL('**/products/**');
    expect(page.url()).toContain('/products/');
    await page.waitForSelector('text=aut consequatur quia esse et');
    await page.locator('a[href="/catalog/products/7494/price"]').click();
    await page.waitForSelector('text=Default Price');

    await page.locator('table tr:nth-child(1)').locator('input').first().click();
    await page.locator('table tr:nth-child(1)').locator('input').first().fill('100');
    await page.locator('table tr:nth-child(1)').locator('input').nth(1).click();
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product pricing updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(1)').locator('input').nth(1).click();
    await page.locator('table tr:nth-child(1)').locator('input').nth(1).fill('100');
    await page.locator('table tr:nth-child(1)').locator('input').first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product pricing updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(1)').locator('input').nth(2).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product pricing updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(1)').locator('input').nth(3).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product pricing updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(1)').locator('a').first().click();
    await page.waitForSelector('text=Edit Price Setting');
    await page.locator('input#min_qty').fill('1');
    await page.locator('input#max_qty').fill('10');
    await page.locator('div[role="combobox"]').first().click();
    await page.locator('div[data-value="1"]').first().click();
    await page.locator('div[role="combobox"]').nth(1).click();
    await page.locator('div[data-value="2"]').nth(1).click();
    await page.getByRole('button', { name: 'Save' }).first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product pricing updated successfully");

    await page.waitForTimeout(700);
    await page.locator("ul[role='tablist'] li").nth(1).click();
    await page.locator('table tr:nth-child(2)').locator('input').nth(1).click();
    await page.locator('table tr:nth-child(2)').locator('input').nth(1).fill('100');
    await page.locator('table tr:nth-child(2)').locator('input').first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product pricing updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(2)').locator('input').nth(1).click();
    await page.locator('table tr:nth-child(2)').locator('input').nth(1).fill('100');
    await page.locator('table tr:nth-child(2)').locator('input').first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product pricing updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(2)').locator('input').nth(2).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product pricing updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(2)').locator('input').nth(3).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product pricing updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(2)').locator('a').first().click();
    await page.waitForSelector('text=Edit Price Setting');
    await page.locator('input#min_qty').fill('1');
    await page.locator('input#max_qty').fill('10');
    await page.locator('div[role="combobox"]').first().click();
    await page.locator('div[data-value="1"]').first().click();
    await page.locator('div[role="combobox"]').nth(1).click();
    await page.locator('div[data-value="2"]').nth(1).click();
    await page.getByRole('button', { name: 'Save' }).first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product pricing updated successfully");
  });
  test("Product Inventory", async ({ page }) => {
    await page.locator('table tr:nth-child(2)').click({ force: true });
    await page.waitForURL('**/products/**');
    expect(page.url()).toContain('/products/');
    await page.waitForSelector('text=aut consequatur quia esse et');
    await page.locator('a[href="/catalog/products/7494/inventory"]').click();
    await page.waitForSelector('text=Option Combos Awaiting Variants');

    await page.getByRole('button', { name: 'Option Combos Awaiting Variants' }).first().click();
    await page.waitForSelector('text=Option Combinations Awaiting');
    await page.locator('table tr:nth-child(1)').locator('a').first().click();
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Variant created successfully");

    await page.waitForTimeout(700);
    await page.getByRole('button', { name: 'Option Combos Awaiting Variants' }).first().click();
    await page.waitForSelector('text=Option Combinations Awaiting');
    await page.getByRole('button', { name: 'Create variants for all' }).first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Variant created successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(1)').locator('input').nth(2).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Values saved successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(1)').getByRole('button',{name:'Unassign'}).click();
    await page.waitForSelector('button span:text("Remove")');
    await page.locator('button span:text("Remove")').first().click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product variant successfully deleted")

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(1)').locator('input').nth(1).click();
    await page.getByRole('button', { name: 'Modify Selected Variant' }).first().click();
    await page.locator('div.absolute').first().locator('select').first().selectOption({index:1})
    await page.locator('div.absolute').first().locator('select').nth(1).selectOption({index:1})
    await page.getByRole('button', { name: 'Save' }).first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Values saved successfully")

    await page.waitForTimeout(700);
    await page.getByRole('button', { name: 'Modify Selected Variant' }).first().click();
    await page.locator('div.absolute').first().locator('select').first().selectOption({index:2})
    await page.locator('div.absolute').first().locator('select').nth(1).selectOption({index:2})
    await page.getByRole('button', { name: 'Save' }).first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Values saved successfully")

    await page.waitForTimeout(700);
    await page.getByRole('button', { name: 'Modify Selected Variant' }).first().click();
    await page.locator('div.absolute').first().locator('select').first().selectOption({index:3})
    await page.locator('div.absolute').first().locator('select').nth(1).selectOption({index:1})
    await page.locator('div.absolute').first().locator('input').fill('5')
    await page.getByRole('button', { name: 'Save' }).first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Values saved successfully")

    await page.waitForTimeout(700);
    await page.getByRole('button', { name: 'Modify Selected Variant' }).first().click();
    await page.locator('div.absolute').first().locator('select').first().selectOption({index:4})
    await page.locator('div.absolute').first().locator('select').nth(1).selectOption({index:1})
    await page.getByRole('button', { name: 'Save' }).first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Values saved successfully")

    await page.waitForTimeout(700);
    await page.getByRole('button', { name: 'Modify Selected Variant' }).first().click();
    await page.locator('div.absolute').first().locator('select').first().selectOption({index:5})
    await page.locator('div.absolute').first().locator('select').nth(1).selectOption({index:1})
    await page.getByRole('button', { name: 'Save' }).first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Values saved successfully")

    await page.waitForTimeout(700);
    await page.locator('table').first().getByRole("row").nth(1).getByRole('cell').nth(2).click({ force: true });
    await page.waitForSelector('text=Product Variant')
    await page.locator('input#weight').fill('10')
    await page.getByRole('button', { name: 'Save' }).first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product updated successfully")

    await page.waitForTimeout(700);
    await page.locator('a.absolute').click();
    await page.locator('ul[role="tablist"]').locator('li').nth(1).click();
    await page.locator('select#default_outofstockstatus_id').selectOption({index:2})
    await page.locator('select#default_distributor_id').selectOption({index:1})
    await page.locator('select#fulfillment_rule_id').selectOption({index:1})
    await page.locator('input#default_cost').fill('10')
    await page.locator('input#inventoried').click();
    await page.getByRole('button', { name: 'Save' }).first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Inventory updated successfully")
  });
  test("Product Accessory", async ({ page }) => {
    await page.locator('table tr:nth-child(2)').click({ force: true });
    await page.waitForURL('**/products/**');
    expect(page.url()).toContain('/products/');
    await page.waitForSelector('text=aut consequatur quia esse et');
    await page.locator('a[href="/catalog/products/7494/accessories"]').click();
    await page.waitForSelector('text=Add Product Accessory');

    await page.getByRole('button', { name: 'Add Product Accessory' }).first().click();
    await page.waitForSelector('text=Search Accessory Product');
    await page.locator('div[role="dialog"] table').getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Accessory Added successfully")

    await page.waitForTimeout(700);
    await page.locator('a.absolute').click();
    await page.locator('table tr:nth-child(2)').locator('input').first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Accessory Updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(2)').locator('input').nth(1).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Accessory Updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(2)').locator('input').nth(2).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Accessory Updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(2)').locator('input').nth(3).click();
    await page.locator('table tr:nth-child(2)').locator('input').nth(3).fill('10');
    await page.locator('table tr:nth-child(2)').getByRole('cell').first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Accessory Updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(2)').locator('a.text-danger').first().click();
    await page.waitForSelector('button span:text("Remove")');
    await page.locator('button span:text("Remove")').first().click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product accessory successfully deleted")

    await page.waitForTimeout(700)
    await page.locator('ul[role="tablist"]').first().locator('li').nth(1).click();
    await page.getByRole('button', { name: 'Add Product Accessory Field' }).first().click();
    await page.waitForSelector('text=Search Accessory Field');
    await page.locator('div[role="dialog"] table').getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Accessory Field Added successfully")

    await page.waitForTimeout(700);
    await page.locator('a.absolute').click();
    await page.locator('table tr:nth-child(1)').locator('input').first().click();
    await page.locator('table tr:nth-child(1)').locator('input').first().fill('10');
    await page.locator('table tr:nth-child(1)').getByRole('cell').first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Accessory Field Updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(1)').locator('a.text-danger').first().click();
    await page.waitForSelector('button span:text("Remove")');
    await page.locator('button span:text("Remove")').first().click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product accessory Field successfully deleted")    
  });
  test("Related Product", async ({ page }) => {
    await page.locator('table tr:nth-child(2)').click({ force: true });
    await page.waitForURL('**/products/**');
    expect(page.url()).toContain('/products/');
    await page.waitForSelector('text=aut consequatur quia esse et');
    await page.locator('a[href="/catalog/products/7494/related"]').click();
    await page.waitForSelector('text=Add Related Product');

    await page.getByRole('button', { name: 'Add Related Product' }).first().click();
    await page.waitForSelector('text=Search Related Product');
    await page.locator('div[role="dialog"] table').getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Related Product Added successfully")

    await page.waitForTimeout(700);
    await page.locator('a.absolute').click();
    await page.locator('table tr:nth-child(2)').locator('a.text-danger').first().click();
    await page.waitForSelector('button span:text("Remove")');
    await page.locator('button span:text("Remove")').first().click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Related Product successfully deleted")
  });

  test("Product Forms", async ({ page }) => {
    await page.locator('table tr:nth-child(2)').click({ force: true });
    await page.waitForURL('**/products/**');
    expect(page.url()).toContain('/products/');
    await page.waitForSelector('text=aut consequatur quia esse et');
    await page.locator('a[href="/catalog/products/7494/forms"]').click();
    await page.waitForSelector('text=Add Product Form');

    await page.getByRole('button', { name: 'Add Product Form' }).first().click();
    await page.waitForSelector('text=Search Custom Forms');
    await page.locator('div[role="dialog"] table').getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Form Added successfully")

    await page.waitForTimeout(700);
    await page.locator('a.absolute').click();
    await page.locator('table tr:nth-child(1)').locator('input').first().click();
    await page.locator('table tr:nth-child(1)').locator('input').first().fill('10');
    await page.locator('table tr:nth-child(1)').getByRole('cell').first().click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Form Updated successfully");

    await page.waitForTimeout(700);
    await page.locator('table tr:nth-child(2)').locator('a.text-danger').first().click();
    await page.waitForSelector('button span:text("Remove")');
    await page.locator('button span:text("Remove")').first().click({ force: true });
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product form successfully deleted")
  });
  test("Product site settings", async ({ page }) => {
    await page.locator('table tr:nth-child(2)').click({ force: true });
    await page.waitForURL('**/products/**');
    expect(page.url()).toContain('/products/');
    await page.waitForSelector('text=aut consequatur quia esse et');
    await page.locator('a[href="/catalog/products/7494/settings"]').click();
    await page.waitForSelector('text=Settings Template');
    await page.waitForSelector('text=System Default (Products Layout)');
    const data = await page.locator("div#__nuxt").textContent();
    expect(data).toContain("System Default (Products Layout)")
    expect(data).toContain("System Default (Product Thumbnail)")

    await page.getByRole('button',{name:'Edit'}).click();
    await page.waitForSelector('text=Site Setting');
    await page.locator("select#settings_template_id_default").selectOption({index:2})
    await page.locator("select#settings_template_id").selectOption({index:1})
    await page.locator("select#layout_id_default").selectOption({index:2})
    await page.locator("select#layout_id").selectOption({index:1})
    await page.locator("select#module_template_id_default").selectOption({index:2})
    await page.locator("select#module_template_id").selectOption({index:1})
    await page.locator("select#product_thumbnail_template_default").selectOption({index:2})
    await page.locator("select#product_thumbnail_template").selectOption({index:1})
    await page.locator("select#product_detail_template_default").selectOption({index:2})
    await page.locator("select#product_detail_template").selectOption({index:1})
    await page.locator("select#product_zoom_template_default").selectOption({index:2})
    await page.locator("select#product_zoom_template").selectOption({index:1})
    await page.getByRole('button',{name:'Save'}).click();
    await page.waitForSelector('div#swal2-html-container');
    let alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Product Site Setting successfully updated");

    await page.waitForTimeout(700);
    await page.getByRole('button',{name:'Manage Module Settings'}).click();
    await page.waitForSelector('text=Module Sections');
    await page.getByRole('button',{name:'Affiliate Account Menu'}).click();
    await page.waitForSelector('text=Fill out the custom fields for modules');

    await page.locator('input').nth(1).click();
    await page.locator('input').nth(1).fill("10");
    await page.locator('input').nth(2).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Values saved successfully");

    await page.waitForTimeout(700);
    await page.locator('input').nth(2).click();
    await page.locator('input').nth(2).fill("10");
    await page.locator('input').nth(1).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Values saved successfully");

    await page.waitForTimeout(700);
    await page.locator('select').first().selectOption({index:3});
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Values saved successfully");

    await page.waitForTimeout(700);
    await page.locator('input').nth(3).click();
    await page.locator('input').nth(3).fill("test data");
    await page.locator('input').nth(1).click();
    await page.waitForSelector('div#swal2-html-container');
    alertText = await page.locator('div#swal2-html-container').first().textContent();
    expect(alertText).toContain("Values saved successfully");


  });
});
