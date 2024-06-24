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
        await page.route(process.env.BACKEND_URL!+"/attribute?**", async route => {
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
    });
    test("Find Keyword Exists", async ({ page }) => {
        await page.locator('select').first().selectOption({index:1})
        await page.locator('select').first().selectOption({index:1})
        await page.waitForSelector('button:text("Search")')
        await page.locator('input#keyword').fill('test');
        await page.locator('select#column').selectOption({index:1})
        await page.locator('select#language_id').selectOption({index:2})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Find Keyword Not Exists", async ({ page }) => {
        await page.locator('select').first().selectOption({index:2})
        await page.locator('select').first().selectOption({index:2})
        await page.waitForSelector('button:text("Search")')
        await page.locator('input#keyword').fill('test');
        await page.locator('select#column').selectOption({index:1})
        await page.locator('select#language_id').selectOption({index:2})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Find Keyword Match", async ({ page }) => {
        await page.locator('select').first().selectOption({index:3})
        await page.locator('select').first().selectOption({index:3})
        await page.waitForSelector('button:text("Search")')
        await page.locator('input#keyword').fill('test');
        await page.locator('select#column').selectOption({index:1})
        await page.locator('select#language_id').selectOption({index:2})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Find Keyword Not Match", async ({ page }) => {
        await page.locator('select').first().selectOption({index:4})
        await page.locator('select').first().selectOption({index:4})
        await page.waitForSelector('button:text("Search")')
        await page.locator('input#keyword').fill('test');
        await page.locator('select#column').selectOption({index:1})
        await page.locator('select#language_id').selectOption({index:2})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Find Product Type Is", async ({ page }) => {
        await page.locator('select').first().selectOption({index:5})
        await page.locator('select').first().selectOption({index:5})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#product_type_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Find Product Type Is Not", async ({ page }) => {
        await page.locator('select').first().selectOption({index:6})
        await page.locator('select').first().selectOption({index:6})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#product_type_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Find Brand Is", async ({ page }) => {
        await page.locator('select').first().selectOption({index:7})
        await page.locator('select').first().selectOption({index:7})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#brand_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Find Brand Is Not", async ({ page }) => {
        await page.locator('select').first().selectOption({index:8})
        await page.locator('select').first().selectOption({index:8})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#brand_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Find Default Distributor Is", async ({ page }) => {
        await page.locator('select').first().selectOption({index:9})
        await page.locator('select').first().selectOption({index:9})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#distributor_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Find Default Distributor Is Not", async ({ page }) => {
        await page.locator('select').first().selectOption({index:10})
        await page.locator('select').first().selectOption({index:10})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#distributor_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Has Any Of The Selected Attributes", async ({ page }) => {
        await page.locator('select').first().selectOption({index:11})
        await page.locator('select').first().selectOption({index:11})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#set_id').selectOption({index:1})
        await page.locator('input[value="80"]').first().click();
        await page.locator('input[value="81"]').first().click();
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Does Not Has Any Of The Selected Attributes", async ({ page }) => {
        await page.locator('select').first().selectOption({index:12})
        await page.locator('select').first().selectOption({index:12})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#set_id').selectOption({index:1})
        await page.locator('input[value="80"]').first().click();
        await page.locator('input[value="81"]').first().click();
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Has All Of The Selected Attributes", async ({ page }) => {
        await page.locator('select').first().selectOption({index:13})
        await page.locator('select').first().selectOption({index:13})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#set_id').selectOption({index:1})
        await page.locator('input[value="80"]').first().click();
        await page.locator('input[value="81"]').first().click();
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Does Not Has All Of The Selected Attributes", async ({ page }) => {
        await page.locator('select').first().selectOption({index:14})
        await page.locator('select').first().selectOption({index:14})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#set_id').selectOption({index:1})
        await page.locator('input[value="80"]').first().click();
        await page.locator('input[value="81"]').first().click();
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Default Category Is", async ({ page }) => {
        await page.locator('select').first().selectOption({index:15})
        await page.locator('select').first().selectOption({index:15})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#category_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Default Category Is Not", async ({ page }) => {
        await page.locator('select').first().selectOption({index:16})
        await page.locator('select').first().selectOption({index:16})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#category_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Combined Stock Quantity Is Between", async ({ page }) => {
        await page.locator('select').first().selectOption({index:17})
        await page.locator('select').first().selectOption({index:17})
        await page.waitForSelector('button:text("Search")')
        await page.locator('input#min').fill("10")
        await page.locator('input#max').fill("80")
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Combined Stock Quantity Is Not Between", async ({ page }) => {
        await page.locator('select').first().selectOption({index:18})
        await page.locator('select').first().selectOption({index:18})
        await page.waitForSelector('button:text("Search")')
        await page.locator('input#min').fill("10")
        await page.locator('input#max').fill("80")
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Status Is", async ({ page }) => {
        await page.locator('select').first().selectOption({index:19})
        await page.locator('select').first().selectOption({index:19})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#status').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Status Is Not", async ({ page }) => {
        await page.locator('select').first().selectOption({index:20})
        await page.locator('select').first().selectOption({index:20})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#status').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Out Of Stock Status Is", async ({ page }) => {
        await page.locator('select').first().selectOption({index:21})
        await page.locator('select').first().selectOption({index:21})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#out_of_stock_status').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Out Of Stock Status Is Not", async ({ page }) => {
        await page.locator('select').first().selectOption({index:22})
        await page.locator('select').first().selectOption({index:22})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#out_of_stock_status').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Default Cost Is Between", async ({ page }) => {
        await page.locator('select').first().selectOption({index:23})
        await page.locator('select').first().selectOption({index:23})
        await page.waitForSelector('button:text("Search")')
        await page.locator('input#min').fill("10")
        await page.locator('input#max').fill("80")
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Default Cost Is Not Between", async ({ page }) => {
        await page.locator('select').first().selectOption({index:24})
        await page.locator('select').first().selectOption({index:24})
        await page.waitForSelector('button:text("Search")')
        await page.locator('input#min').fill("10")
        await page.locator('input#max').fill("80")
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Published On SIte", async ({ page }) => {
        await page.locator('select').first().selectOption({index:25})
        await page.locator('select').first().selectOption({index:25})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#site_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Not Published On Site", async ({ page }) => {
        await page.locator('select').first().selectOption({index:26})
        await page.locator('select').first().selectOption({index:26})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#site_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Weight Is Between", async ({ page }) => {
        await page.locator('select').first().selectOption({index:27})
        await page.locator('select').first().selectOption({index:27})
        await page.waitForSelector('button:text("Search")')
        await page.locator('input#min').fill("10")
        await page.locator('input#max').fill("80")
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Weight Is Not Between", async ({ page }) => {
        await page.locator('select').first().selectOption({index:28})
        await page.locator('select').first().selectOption({index:28})
        await page.waitForSelector('button:text("Search")')
        await page.locator('input#min').fill("10")
        await page.locator('input#max').fill("80")
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Thumbnail Template Is", async ({ page }) => {
        await page.locator('select').first().selectOption({index:29})
        await page.locator('select').first().selectOption({index:29})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#template_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Thumbnail Template Is Not", async ({ page }) => {
        await page.locator('select').first().selectOption({index:30})
        await page.locator('select').first().selectOption({index:30})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#template_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Detail Template Is", async ({ page }) => {
        await page.locator('select').first().selectOption({index:31})
        await page.locator('select').first().selectOption({index:31})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#template_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Detail Template Is Not", async ({ page }) => {
        await page.locator('select').first().selectOption({index:32})
        await page.locator('select').first().selectOption({index:32})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#template_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Zoom Template Is", async ({ page }) => {
        await page.locator('select').first().selectOption({index:33})
        await page.locator('select').first().selectOption({index:33})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#template_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Zoom Template Is Not", async ({ page }) => {
        await page.locator('select').first().selectOption({index:34})
        await page.locator('select').first().selectOption({index:34})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#template_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Is Inventoried", async ({ page }) => {
        await page.locator('select').first().selectOption({index:35})
        await page.locator('select').first().selectOption({index:35})
        await page.waitForSelector('button:text("Search")')
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Is Not Inventoried", async ({ page }) => {
        await page.locator('select').first().selectOption({index:36})
        await page.locator('select').first().selectOption({index:36})
        await page.waitForSelector('button:text("Search")')
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Parent Product Id Is", async ({ page }) => {
        await page.locator('select').first().selectOption({index:37})
        await page.locator('select').first().selectOption({index:37})
        await page.waitForSelector('button:text("Search")')
        await page.locator('input#value').fill("10");
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Ordering Rule Is", async ({ page }) => {
        await page.locator('select').first().selectOption({index:39})
        await page.locator('select').first().selectOption({index:39})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#ordering_rule_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Ordering Rule Is Not", async ({ page }) => {
        await page.locator('select').first().selectOption({index:38})
        await page.locator('select').first().selectOption({index:38})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#ordering_rule_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Assigned To Discount Level", async ({ page }) => {
        await page.locator('select').first().selectOption({index:40})
        await page.locator('select').first().selectOption({index:40})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#discount_level_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Not Assigned To Discount Level", async ({ page }) => {
        await page.locator('select').first().selectOption({index:41})
        await page.locator('select').first().selectOption({index:41})
        await page.waitForSelector('button:text("Search")')
        await page.locator('select#discount_level_id').selectOption({index:1})
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Is Parent", async ({ page }) => {
        await page.locator('select').first().selectOption({index:42})
        await page.locator('select').first().selectOption({index:42})
        await page.waitForSelector('button:text("Search")')
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
    test("Is Child", async ({ page }) => {
        await page.locator('select').first().selectOption({index:43})
        await page.locator('select').first().selectOption({index:43})
        await page.waitForSelector('button:text("Search")')
        await page.getByRole('button',{name:'Search'}).click();
        await page.waitForSelector('text=cumque asperiores incidunt aut totam')
    });
});