import { test, expect } from "@playwright/test";
import find from "../../assets/json/test/product_bulk_edit/find.json";
import perform from "../../assets/json/test/product_bulk_edit/perform.json";
import finds from "../../assets/json/test/product_bulk_edit/finds.json";
import attributeSet from "../../assets/json/test/product_bulk_edit/attributeSet.json";
import attributes from "../../assets/json/test/product_bulk_edit/attributes.json";
import languages from "../../assets/json/test/languages.json";
import productType from "../../assets/json/test/productType.json";
import brands from "../../assets/json/test/brands.json";
import distributors from "../../assets/json/test/distributors.json";
import sites from "../../assets/json/test/discount-rule/sites.json";
import categories from "../../assets/json/test/categories.json";
import availlibility from "../../assets/json/test/discount-rule/availlibility.json";
import detailTemplate from "../../assets/json/test/template/detailTemplate.json";
import thumbnailTemplate from "../../assets/json/test/template/thumbnailTemplate.json";
import zoomTemplate from "../../assets/json/test/template/zoomTemplate.json";
import orderingRules from "../../assets/json/test/orderingRules.json";
import discountLevel from "../../assets/json/test/discountLevel.json";
test.describe("Product Bulk Edit", () => {
    test.beforeEach(async ({ page }) => {
        page.setDefaultTimeout(30000)
        await page.route(process.env.BACKEND_URL! + "/bulk-edit-find", async route => {
            const request = route.request();
            const method = request.method();
            if (method == "GET") {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(find),
                });
            }
            if (method == "POST") {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(finds),
                });
            }
        })
        await page.route(process.env.BACKEND_URL! + "/bulk-edit-perform", async route => {
            const request = route.request();
            const method = request.method();
            if (method == "GET") {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(perform),
                });
            }
            if (method == "POST") {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: '2',
                });
            }
        })
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
        await page.route(process.env.BACKEND_URL!+"/distributors", async route => {
            const request = route.request();
            const method = request.method();
            if (method == "GET") {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(distributors),
                });
            }
        });
        await page.route(process.env.BACKEND_URL!+"/attribute-set", async route => {
            const request = route.request();
            const method = request.method();
            if (method == "GET") {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(attributeSet),
                });
            }
        });
        await page.route(process.env.BACKEND_URL!+"/attribute?set_id=**", async route => {
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
        await page.route(process.env.BACKEND_URL!+"/site/", async route => {
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
        await page.route(process.env.BACKEND_URL!+"/discount-level", async route => {
            const request = route.request();
            const method = request.method();
            if (method == "GET") {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(discountLevel),
                });
            }
        });
        const promiseLoad = page.waitForEvent("load");
        await page.goto(process.env.FRONTEND_URL!+"/dashboard");
        await page.waitForLoadState('networkidle');
        await promiseLoad;
        const firstMenu = await page.locator('ul[data-v-inspector="layouts/simple-menu-new.vue:44:9"]').first().locator('li').nth(1);
        await firstMenu.locator('a').click({ force: true });
        const fourthMenu = await firstMenu.locator('ul').first().locator('li').nth(3)
        await fourthMenu.locator('a').click({ force: true });
        await page.waitForURL('**/catalog/products/editor');
        await page.locator('select').first().selectOption({index:2})
        await page.locator('select').first().selectOption({index:1})
        await page.waitForSelector('button:text("Search")')
        await page.locator('input#keyword').fill('test');
        await page.locator('select#column').selectOption({index:1})
        await page.locator('select#language_id').selectOption({index:2})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
        await page.locator('input[type="checkbox"]').first().click();
        await page.locator('input[value="7503"]').first().click();
        await page.locator('input[value="7504"]').first().click();
    });
    test("Replace Subtext With Text", async ({ page }) => {
        await page.locator('select').first().selectOption({index:1})
        await page.locator('select').first().selectOption({index:1})
        await page.locator('input#keyword').fill('t');
        await page.locator('select#column').selectOption({index:1});
        await page.locator('input#replace').fill('p');
        await page.locator('select#language_id').selectOption({index:1});
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Set Pricing", async ({ page }) => {
        await page.locator('select').first().selectOption({index:2})
        await page.locator('select').first().selectOption({index:2})
        await page.locator('select#site_id').selectOption({index:1});
        await page.locator('input#price_reg').fill('100');
        await page.locator('input#onsale').click();
        await page.locator('input#price_sale').fill('90');
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Set Status", async ({ page }) => {
        await page.locator('select').first().selectOption({index:3})
        await page.locator('select').first().selectOption({index:3})
        await page.locator('select#status').selectOption({index:1});
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Set Out Of Stoick Status", async ({ page }) => {
        await page.locator('select').first().selectOption({index:4})
        await page.locator('select').first().selectOption({index:4})
        await page.locator('select#out_of_stock_status').selectOption({index:1});
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Assign Brand", async ({ page }) => {
        await page.locator('select').first().selectOption({index:5})
        await page.locator('select').first().selectOption({index:5})
        await page.locator('select#brand_id').selectOption({index:1});
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Assign Product Type", async ({ page }) => {
        await page.locator('select').first().selectOption({index:6})
        await page.locator('select').first().selectOption({index:6})
        await page.locator('select#product_type_id').selectOption({index:1});
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Assign Attribute", async ({ page }) => {
        await page.locator('select').first().selectOption({index:7})
        await page.locator('select').first().selectOption({index:7})
        await page.locator('select').nth(1).selectOption({index:1});
        await page.locator('select').nth(1).selectOption({index:1});
        await page.locator('div[role="combobox"]').first().click();
        await page.locator('div[data-value="81"]').first().click();
        await page.locator('div[role="combobox"]').nth(1).click();
        await page.locator('div[data-value="111"]').first().click();
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("UnAssign Attribute", async ({ page }) => {
        await page.locator('select').first().selectOption({index:8})
        await page.locator('select').first().selectOption({index:8})
        await page.locator('select').nth(1).selectOption({index:1});
        await page.locator('select').nth(1).selectOption({index:1});
        await page.locator('div[role="combobox"]').first().click();
        await page.locator('div[data-value="81"]').first().click();
        await page.locator('div[role="combobox"]').nth(1).click();
        await page.locator('div[data-value="111"]').first().click();
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Assign Distributor", async ({ page }) => {
        await page.locator('select').first().selectOption({index:9})
        await page.locator('select').first().selectOption({index:9})
        await page.locator('select#distributor_id').selectOption({index:1});
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Published On Site", async ({ page }) => {
        await page.locator('select').first().selectOption({index:10})
        await page.locator('select').first().selectOption({index:10})
        await page.locator('select#site_id').selectOption({index:1});
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("UnPublished On Site", async ({ page }) => {
        await page.locator('select').first().selectOption({index:11})
        await page.locator('select').first().selectOption({index:11})
        await page.locator('select#site_id').selectOption({index:1});
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Assign Default Category", async ({ page }) => {
        await page.locator('select').first().selectOption({index:12})
        await page.locator('select').first().selectOption({index:12})
        await page.locator('select#category_id').selectOption({index:1});
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Set Weight", async ({ page }) => {
        await page.locator('select').first().selectOption({index:13})
        await page.locator('select').first().selectOption({index:13})
        await page.locator('input#weight').fill("10");
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Set Thumbnail Template", async ({ page }) => {
        await page.locator('select').first().selectOption({index:14})
        await page.locator('select').first().selectOption({index:14})
        await page.locator('select#template_id').selectOption({index:1});
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Set Detail Template", async ({ page }) => {
        await page.locator('select').first().selectOption({index:15})
        await page.locator('select').first().selectOption({index:15})
        await page.locator('select#template_id').selectOption({index:1});
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Set Zoom Template", async ({ page }) => {
        await page.locator('select').first().selectOption({index:16})
        await page.locator('select').first().selectOption({index:16})
        await page.locator('select#template_id').selectOption({index:1});
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Set Inventoried", async ({ page }) => {
        await page.locator('select').first().selectOption({index:17})
        await page.locator('select').first().selectOption({index:17})
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Set Not Inventoried", async ({ page }) => {
        await page.locator('select').first().selectOption({index:18})
        await page.locator('select').first().selectOption({index:18})
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Set Ordering Rule", async ({ page }) => {
        await page.locator('select').first().selectOption({index:19})
        await page.locator('select').first().selectOption({index:19})
        await page.locator('select#site_id').selectOption({index:1});
        await page.locator('select#ordering_rule_id').selectOption({index:1});
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Assign Discount Level", async ({ page }) => {
        await page.locator('select').first().selectOption({index:20})
        await page.locator('select').first().selectOption({index:20})
        await page.locator('select#discount_level_id').selectOption({index:1});
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("UnAssign Discount Level", async ({ page }) => {
        await page.locator('select').first().selectOption({index:21})
        await page.locator('select').first().selectOption({index:21})
        await page.locator('select#discount_level_id').selectOption({index:1});
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
    test("Modify Distributor Stock Quantity", async ({ page }) => {
        await page.locator('select').first().selectOption({index:22})
        await page.locator('select').first().selectOption({index:22})
        await page.locator('select#distributor_id').selectOption({index:1});
        await page.locator('input#stock_qty').fill("10");
        await page.getByRole('button',{name:'Save'}).click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Product updated successfully");
    });
});