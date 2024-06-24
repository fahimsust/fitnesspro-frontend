import { test, expect } from "@playwright/test";
import order from "../../assets/json/test/order/order.json";
import orders from "../../assets/json/test/order/orders.json";
import discounts from "../../assets/json/test/discounts.json";
import distributors from "../../assets/json/test/distributors.json";
import products from "../../assets/json/test/products.json";
import orderProduct from "../../assets/json/test/order/orderProduct.json";
import customForms from "../../assets/json/test/order/customForms.json";
import transactions from "../../assets/json/test/order/transactions.json";
import orderItem from "../../assets/json/test/order/orderItem.json";
import address from "../../assets/json/test/order/address.json";
import accounts from "../../assets/json/test/customer/accounts.json";
import orderActivity from "../../assets/json/test/order/orderActivity.json";
import orderAffiliate from "../../assets/json/test/order/orderAffiliate.json";
import note from "../../assets/json/test/order/note.json";
import countries from "../../assets/json/test/countries.json";
import states from "../../assets/json/test/customer/states.json";
import affiliate from "../../assets/json/test/affiliate.json";
import messageTemplates from "../../assets/json/test/messageTemplates.json";
import contactCustomer from "../../assets/json/test/customer/contactCustomer.json";

test.describe("Order", () => {
    test.beforeEach(async ({ page }) => {
        page.setDefaultTimeout(30000)
        await page.route(process.env.BACKEND_URL!+"/orders?page=1**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(orders),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/product/**/order-product", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET")
            {
                await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(orderProduct),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/package/**/item/", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "POST")
            {
                await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(orderItem),
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
        await page.route(process.env.BACKEND_URL!+"/orders/2", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(order)
                });
            }
            if(method == "PUT")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: '1'
                });
            }
        });
        await page.route(process.env.BACKEND_URL!+"/order/2/shipment/**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "PUT" || method == "DELETE")
            {
                await route.fulfill({
                    status: 201,
                    contentType: "application/json",
                    body: '1',
                });
            }
            if(method == "POST")
            {
                await route.fulfill({
                    status: 201,
                    contentType: "application/json",
                    body: '{"is_downloads": true,"distributor_id": 1,"order_id": 2,"id": 32,"order_status_id": 15}',
                });
            }
        });
        await page.route(process.env.BACKEND_URL!+"/discount/**/item/**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "POST")
            {
                await route.fulfill({
                    status: 201,
                    contentType: "application/json",
                    body: '[{"discount_id": 3,"amount": "10","advantage_id": 7,"orders_products_id": 80,"qty": 1,"id": 2}]',
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
        });
        await page.route(process.env.BACKEND_URL!+"/order/2/discount/**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "POST" || method == "DELETE")
            {
                await route.fulfill({
                    status: 201,
                    contentType: "application/json",
                    body: '1',
                });
            }
        });
        await page.route(process.env.BACKEND_URL!+"/discount?page=1**", async route => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(discounts)
            });
        });
        await page.route(process.env.BACKEND_URL!+"/shipment/29/order-package/**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "POST")
            {   
                await route.fulfill({
                    status: 201,
                    contentType: "application/json",
                    body: '{"shipment_id":29,"id":73}',
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
            if(method == "PUT")
            {
                await route.fulfill({
                    status: 201,
                    contentType: "application/json",
                    body: '{"message":"Package 81 moved from shipment 38 to 37"}',
                });
            }
        });

        await page.route(process.env.BACKEND_URL!+"/package/**/delete-items/", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "POST")
            {
                await route.fulfill({
                    status: 201,
                    contentType: "application/json",
                    body: '1',
                });
            }
        });

        await page.route(process.env.BACKEND_URL!+"/package/**/item/**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "POST" || method == "PUT")
            {
                await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: "1",
                });
            }
        })

        await page.route(process.env.BACKEND_URL!+"/order-item/**/note/", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "POST")
            {
                await route.fulfill({
                    status: 201,
                    contentType: "application/json",
                    body: '1',
                });
            }
        });
        await page.route(process.env.BACKEND_URL!+"/accounts?page=1**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",            
                    body: JSON.stringify(accounts),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/order/2/account/**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "DELETE" || method == "PUT")
            {
                await route.fulfill({
                    status: 201,
                    contentType: "application/json",
                    body: '1',
                });
            }
        });
        await page.route(process.env.BACKEND_URL!+"/order/2/activity**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(orderActivity),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/order/2/note?**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET" || method == "POST")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(note),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/order/2/custom-forms?**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET" || method == "POST" || method == "PUT")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(customForms),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/order/2/transaction?**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET" || method == "POST")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(transactions),
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
        await page.route("*/**/states/**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(states),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/address?**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET" || method == "PUT" || method == "POST")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(address),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/order/2/address", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "POST")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: '1',
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/affiliate?page=1**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(affiliate),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/order/2/affiliate?**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(orderAffiliate),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/order/2/remove-affiliate/", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "POST")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: '1',
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/message-template", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(messageTemplates),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/contact-customer?**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET" || method == "POST")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(contactCustomer),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/order/2/send-mail/", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "POST")
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
        const firstMenu = await page.locator('ul[data-v-inspector="layouts/simple-menu-new.vue:44:9"]').first().locator('li').first();
        await firstMenu.locator('a').click({ force: true });
        await firstMenu.locator('ul').first().locator('li').first().locator('a').click({ force: true });
        await page.waitForURL('**/actives');
    });
    test("Lists", async ({ page }) => {
        await page.waitForSelector('text=19127286');
        const tableText = await page.locator('table').first().textContent();
        expect(tableText).toContain('NON-SHIP/DWNLDS');
        expect(tableText).toContain('Ready to Ship');
        expect(tableText).toContain('Cancelled');
    });
    test("Go To Edit Page", async ({ page }) => {
        await page.locator('table tr:nth-child(2)').click({ force: true });
        await page.waitForURL('**/actives/2');
        expect(page.url()).toContain('/actives/2');
        await page.waitForTimeout(700)
    });
    test("Edit And Add Shipment And Discount", async ({ page }) => {
        await page.locator('table tr:nth-child(2)').click({ force: true });
        await page.waitForURL('**/actives/2');
        expect(page.url()).toContain('/actives/2');
        await page.waitForSelector('text=Downloadable #29')

        await page.locator('div[aria-haspopup="menu"]').nth(3).click({ force: true });
        await page.locator('select').first().selectOption({ index: 1 });
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Shipment Updated Successfully");

        await page.waitForTimeout(700);
        await page.locator('select').nth(1).selectOption({ index: 1 });
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Shipment Updated Successfully");

        await page.waitForTimeout(700);
        await page.getByRole('button', { name: 'New Downloadable' }).first().click();
        await page.waitForSelector('select#distributor_id');
        await page.locator('select#distributor_id').first().selectOption({index:1});
        await page.getByRole('button', { name: 'Save' }).first().click();
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Shipment created successfully");

        await page.waitForTimeout(700);
        await page.getByRole('button', { name: 'New Shipment' }).first().click();
        await page.waitForSelector('select#distributor_id');
        await page.locator('select#distributor_id').first().selectOption({index:1});
        await page.getByRole('button', { name: 'Save' }).first().click();
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Shipment created successfully");

        await page.waitForTimeout(700);
        await page.getByRole('button', { name: 'Apply Discount' }).first().click();
        await page.waitForSelector('text=iure');
        await page.locator('div[role="dialog"] table').first().getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Discount added successfully");

        await page.waitForTimeout(700);
        await page.locator('text=50.00').first().click();
        await page.waitForSelector('input#addtl_fee');
        await page.locator('input#addtl_fee').first().fill('55');
        await page.locator('text=- 15.00').first().click();
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Order additional fees/additional discount updated successfully");

        await page.waitForTimeout(700);
        await page.waitForSelector('input#addtl_discount');
        await page.locator('input#addtl_discount').first().fill('10');
        await page.locator('text=50.00').first().click();
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Order additional fees/additional discount updated successfully");

        const bodyText = await page.locator('body').textContent();
        expect(bodyText).toContain('3972.00');
        expect(bodyText).toContain('4019.00');
        expect(bodyText).toContain('22.00');
    });

    test("Shipment Modification", async ({ page }) => {
        await page.locator('table tr:nth-child(2)').click({ force: true });
        await page.waitForURL('**/actives/2');
        expect(page.url()).toContain('/actives/2');
        await page.waitForSelector('text=Downloadable #29')

        await page.waitForTimeout(700);
        await page.locator('div[aria-haspopup="menu"]').nth(2).click({ force: true });
        await page.locator('text=Create Package').first().click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("New package created successfully");

        await page.waitForTimeout(700);
        await page.locator('div[aria-haspopup="menu"]').nth(2).click({ force: true });
        await page.locator('text=Delete Shipment').first().click();
        await page.waitForSelector('button span:text("Remove")');
        await page.locator('button span:text("Remove")').first().click({ force: true });
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Shipment successfully deleted");

        await page.waitForTimeout(700);
        await page.locator('text=12.00').first().click();
        await page.waitForSelector('input#ship_cost'); 
        await page.locator('text=Downloadable #29').first().click();
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Shipment Updated Successfully");
    })

    test("Package Modification", async ({ page }) => {
        await page.locator('table tr:nth-child(2)').click({ force: true });
        await page.waitForURL('**/actives/2');
        expect(page.url()).toContain('/actives/2');
        await page.waitForSelector('text=Downloadable #29')

        await page.waitForTimeout(700);
        await page.locator('div[aria-haspopup="menu"]').nth(3).click({ force: true });
        await page.locator('text=Delete Package').first().click();
        await page.waitForSelector('button span:text("Remove")');
        await page.locator('button span:text("Remove")').first().click({ force: true });
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Package successfully deleted");

        await page.waitForTimeout(700);
        await page.locator('div[aria-haspopup="menu"]').nth(3).click({ force: true });
        await page.locator('text=Add Items').first().click();
        await page.waitForSelector('text=aut consequatur quia esse et');
        await page.locator('div[role="dialog"] table').first().getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true })
        await page.waitForSelector('text=fugit a voluptatem est iusto');
        await page.getByRole('button', { name: 'Add' }).first().click();
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Order item created successfully");

        await page.waitForTimeout(700);
        await page.locator('div[aria-haspopup="menu"]').nth(3).click({ force: true });
        await page.locator('text=Move Package').first().click();
        await page.locator('div.container').first().locator('div.absolute').first().click();
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Package moved to new shipment successfully");
    })

    test("Package Items Modification", async ({ page }) => {
        await page.locator('table tr:nth-child(2)').click({ force: true });
        await page.waitForURL('**/actives/2');
        expect(page.url()).toContain('/actives/2');
        await page.waitForSelector('text=Downloadable #29')

        await page.locator('div[aria-haspopup="menu"]').nth(3).click({ force: true });
        await page.locator('div.playwright-item-move input[type="checkbox"]').first().click();
        await page.getByRole('button', { name: 'Add Discount' }).first().click();
        await page.waitForSelector('text=iure');
        await page.locator('div[role="dialog"] table').first().getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Discount added successfully"); 

        await page.waitForTimeout(700);
        await page.locator('div[aria-haspopup="menu"]').nth(3).click({ force: true });
        await page.locator('text=Delete Items').first().click();
        await page.waitForSelector('button span:text("Remove")');
        await page.locator('button span:text("Remove")').first().click({ force: true });
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Items successfully deleted");

        await page.waitForTimeout(700);
        await page.locator('div.playwright-item-move svg').first().click();
        await page.locator('div.container').first().locator('div.absolute').first().click();
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Order Item moved successfully");

        await page.waitForTimeout(700);
        await page.locator('text=Quantity : 1').first().click();
        await page.locator('input#product_qty').first().fill("2");
        await page.keyboard.press('Enter');
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Item qty successfully updated")

        await page.waitForTimeout(700);
        await page.locator('svg.playwright-item-discount-delete').first().click();
        await page.waitForSelector('button span:text("Remove")');
        await page.locator('button span:text("Remove")').first().click({ force: true });
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Order discount item successfully deleted")

        await page.waitForTimeout(700);
        await page.locator('svg.playwright-discount-delete').first().click();
        await page.waitForSelector('button span:text("Remove")');
        await page.locator('button span:text("Remove")').first().click({ force: true });
        await page.waitForSelector('div#swal2-html-container'); 
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Order discount successfully deleted")

        await page.waitForTimeout(700);
        await page.locator('svg.playwright-edit-item').first().click();
        await page.waitForSelector('input#note');
        await page.locator('input#note').first().fill("this is  test note");
        await page.getByRole('button', { name: 'Save' }).first().click();
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Order item note updated")
   
    })
    test("Order Account", async ({ page }) => {
        await page.locator('table tr:nth-child(2)').click({ force: true });
        await page.waitForURL('**/actives/2');
        expect(page.url()).toContain('/actives/2');
        await page.waitForSelector('text=Downloadable #29');
        await page.locator("nav").nth(2).locator('li').nth(1).click();
        await page.waitForSelector('text=Assigned Account');
        let textContent = await page.locator("div#__nuxt").textContent();
        expect(textContent).toContain("Marvin Heller");
        await page.locator('button:text("Manage Account")').click();
        const orderContent = await page.locator('div[role="dialog"]').textContent();
        expect(orderContent).toContain("Marvin Heller");
        await page.locator("a.absolute").click();

        await page.locator('button:text("Assign New")').click();
        await page.waitForSelector('text=Search Customer');
        await page.locator('div[role="dialog"] table').first().getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Account successfully assign to the order");

        await page.waitForTimeout(700);
        await page.locator('button:text("Unassign")').click();
        await page.waitForSelector('button span:text("Remove")');
        await page.locator('button span:text("Remove")').first().click({ force: true });
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Account successfully removed")
    });
    test("Order Activity", async ({ page }) => {
        await page.locator('table tr:nth-child(2)').click({ force: true });
        await page.waitForURL('**/actives/2');
        expect(page.url()).toContain('/actives/2');
        await page.waitForSelector('text=Downloadable #29');
        await page.locator("nav").nth(2).locator('li').nth(2).click();
        await page.waitForSelector('text=Order Activity');
        const textContent = await page.locator('table').first().getByRole("row").nth(1).textContent();
        expect(textContent).toContain("Geovanny Wyman")
    });
    test("Order Notes", async ({ page }) => {
        await page.locator('table tr:nth-child(2)').click({ force: true });
        await page.waitForURL('**/actives/2');
        expect(page.url()).toContain('/actives/2'); 
        await page.waitForSelector('text=Downloadable #29');
        await page.locator("nav").nth(2).locator('li').nth(3).click();      
        await page.waitForSelector('text=Create Note');
        const textContent = await page.locator('table').first().getByRole("row").nth(2).textContent();  
        expect(textContent).toContain("Ullam ea illum est rerum dolor dolorem pariatur maiores.")
        await page.locator('button:text("Create Note")').first().click();
        await page.waitForSelector("text=Add Note");
        await page.locator("textarea#note").fill("test data");
        await page.locator('button:text("Save")').first().click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Note created successfully")
    });
    test("Custom Forms", async ({ page }) => {
        await page.locator('table tr:nth-child(2)').click({ force: true });
        await page.waitForURL('**/actives/2');
        expect(page.url()).toContain('/actives/2');
        await page.waitForSelector('text=Downloadable #29');
        await page.locator("nav").nth(2).locator('li').nth(4).click();
        await page.waitForSelector('text=Custom Forms');
        const textContent = await page.locator('table').first().getByRole("row").nth(1).textContent();
        expect(textContent).toContain("delectus velit")
        await page.locator('table').first().getByRole("row").nth(1).getByRole("cell").first().click({force:true})
        await page.waitForSelector("text=Edit Custom Data delectus velit")
        await page.locator('input').first().fill("testing")
        await page.locator('input').nth(1).fill("testing 2")
        await page.locator('button:text("Save")').first().click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Custom form successfully updated")
    });
    test("Order Transaction", async ({ page }) => {
        await page.locator('table tr:nth-child(2)').click({ force: true });
        await page.waitForURL('**/actives/2');
        expect(page.url()).toContain('/actives/2');
        await page.waitForSelector('text=Downloadable #29');
        await page.locator("nav").nth(2).locator('li').nth(5).click();
        await page.waitForSelector('text=Order Transactions');
        const textContent = await page.locator('table').first().getByRole("row").nth(1).textContent();
        expect(textContent).toContain("e16a5d80-a510-3e89-b")
    });
    test("Order Address", async ({ page }) => {
        await page.locator('table tr:nth-child(2)').click({ force: true });
        await page.waitForURL('**/actives/2');
        expect(page.url()).toContain('/actives/2');
        await page.waitForSelector('text=Downloadable #29');
        await page.locator("nav").nth(2).locator('li').nth(6).click();
        await page.waitForSelector('text=Shipping Address');
        const textContent = await page.locator('div#__nuxt').textContent();
        expect(textContent).toContain("fay.altenwerth@gmail.com")
        expect(textContent).toContain("estefania30@watsica.net")
        await page.locator('button:text("Manage Shipping Address")').first().click();
        await page.waitForSelector('text=Current Address');
        await page.locator('button:text("Edit")').first().click();
        await page.waitForSelector('text=Edit Address');
        await page.locator('select#country_id').selectOption({index:3});
        await page.waitForLoadState('networkidle');
        await page.locator('input#label').fill('wisoky.eulaa');
        await page.locator('input#first_name').fill('first_name');
        await page.locator('input#last_name').fill('last_name');
        await page.locator('input#email').fill('Email Address');
        await page.locator('input#phone').fill('01534616103');
        await page.locator('input#company').fill('last_name');
        await page.locator('input#address_1').fill('Address 1');
        await page.locator('input#address_2').fill('Address 2');
        await page.locator('input#city').fill('city');
        await page.locator('input#postal_code').fill('zipcode')
        await page.locator('select#state_id').selectOption({index:3});
        await page.getByRole('button', { name: 'Save' }).first().click();
        await page.waitForTimeout(300)
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Address assign to the order");

        await page.waitForTimeout(700)
        await page.locator('button:text("Create New Address")').first().click();
        await page.waitForSelector('text=Create Address');
        await page.locator('select#country_id').selectOption({index:3});
        await page.waitForLoadState('networkidle');
        await page.locator('input#label').fill('wisoky.eulaa');
        await page.locator('input#first_name').fill('first_name');
        await page.locator('input#last_name').fill('last_name');
        await page.locator('input#email').fill('Email Address');
        await page.locator('input#phone').fill('01534616103');
        await page.locator('input#company').fill('last_name');
        await page.locator('input#address_1').fill('Address 1');
        await page.locator('input#address_2').fill('Address 2');
        await page.locator('input#city').fill('city');
        await page.locator('input#postal_code').fill('zipcode')
        await page.locator('select#state_id').selectOption({index:3});
        await page.getByRole('button', { name: 'Save' }).first().click();
        await page.waitForTimeout(300)
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Address assign to the order");
    });
    test("Order Affiliates", async ({ page }) => {
        await page.locator('table tr:nth-child(2)').click({ force: true });
        await page.waitForURL('**/actives/2');
        expect(page.url()).toContain('/actives/2');
        await page.waitForSelector('text=Downloadable #29');
        await page.locator("nav").nth(2).locator('li').nth(7).click();
        await page.waitForSelector('text=Assigned Affiliate');
        const textContent = await page.locator('table').first().getByRole("row").nth(1).textContent();
        expect(textContent).toContain("Miss Carolyne Daugherty")

        await page.waitForTimeout(700);
        await page.locator('table').first().getByRole("row").nth(1).locator('a').first().click();
        await page.waitForSelector('button span:text("Unassign")');
        await page.locator('button span:text("Unassign")').first().click({ force: true });
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Affiliate unassigned successfully")
    });
    test("Order Email", async ({ page }) => {
        await page.locator('table tr:nth-child(2)').click({ force: true });
        await page.waitForURL('**/actives/2');
        expect(page.url()).toContain('/actives/2');
        await page.waitForSelector('text=Downloadable #29');
        await page.locator("nav").nth(2).locator('li').nth(8).click();
        await page.waitForSelector('text=Contact Customer');
        const textContent = await page.locator('table').first().getByRole("row").nth(1).textContent();
        expect(textContent).toContain("vernice.balistreri@gmail.com")

        await page.getByRole('button', { name: 'Contact Customer' }).first().click();
        await page.waitForSelector("text=Load a Message Template");
        await page.locator("select#message_template_id").selectOption({index:4})
        await page.waitForLoadState('networkidle');
        const inputSubject = await page.locator("input#subject");
        await expect(inputSubject).toHaveValue("Default Site Password Reset");
        const editorData = await page.locator("div.ck-content").textContent();
        expect(editorData).toContain("Dear Estel");
        await page.getByRole('button', { name: 'Send' }).first().click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Email successfully sent to customer");

        await page.waitForTimeout(700);
        await page.getByRole('button', { name: 'Email Order To Customer' }).first().click();
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Order email send successfully");
    });

  
});
