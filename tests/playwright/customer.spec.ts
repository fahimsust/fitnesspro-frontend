import { test, expect } from "@playwright/test";
import accountStatus from "../../assets/json/test/customer/accountStatus.json";
import accounts from "../../assets/json/test/customer/accounts.json";
import account from "../../assets/json/test/customer/account.json";
import accountTypes from "../../assets/json/test/customer/accountTypes.json";
import accountAddress from "../../assets/json/test/customer/accountAddress.json";
import membershipLevel from "../../assets/json/test/customer/membershipLevel.json";
import accountMembership from "../../assets/json/test/customer/accountMembership.json";
import accountMemberships from "../../assets/json/test/customer/accountMemberships.json";
import accountSpecialty from "../../assets/json/test/customer/accountSpecialty.json";
import contactCustomer from "../../assets/json/test/customer/contactCustomer.json";
import states from "../../assets/json/test/customer/states.json";
import messageTemplate from "../../assets/json/test/customer/messageTemplate.json";
import accountAddressAll from "../../assets/json/test/customer/accountAddressAll.json";
import accountOrder from "../../assets/json/test/customer/accountOrder.json";
import accountPhoto from "../../assets/json/test/customer/accountPhoto.json";
import accountFile from "../../assets/json/test/customer/accountFile.json";
import certificates from "../../assets/json/test/customer/certificates.json";
import countries from "../../assets/json/test/countries.json";
import messageTemplates from "../../assets/json/test/messageTemplates.json";
import order from "../../assets/json/test/order/order.json";

test.describe("Customer", () => {
    test.beforeEach(async ({ page }) => {
        await page.route(process.env.BACKEND_URL!+"/account-type", async route => {
            const request = route.request();
            const method = request.method();
            if (method == "GET") {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(accountTypes),
                });
            }
        });
        await page.route(process.env.BACKEND_URL!+"/account-status", async route => {
            const request = route.request();
            const method = request.method();
            if (method == "GET") {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(accountStatus),
                });
            }
        });
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
        await page.route(process.env.BACKEND_URL!+"/accounts/**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET" || method == "PUT")
            {
              await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(account),
              });
            }
        })
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
        await page.route(process.env.BACKEND_URL!+"/account-address?account_id=34", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(accountAddress),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/account-address?account_id=34&status=-1", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(accountAddressAll),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/account-address/**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "POST" || method == "DELETE" || method == "PUT")
            {
              await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: '1',
              });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/account-address", async route => {
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
        await page.route(process.env.BACKEND_URL!+"/account-membership?account_id=34", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(accountMemberships),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/account-membership/**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET" || method == "POST" || method == "PUT" || method == "DELETE")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(accountMembership),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/membership-levels/", async route => {
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
        await page.route(process.env.BACKEND_URL!+"/account-specialty?account_id=34", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(accountSpecialty),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/account-specialty/**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "POST" || method == "DELETE")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: "1",
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/contact-customer?account_id=34", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(contactCustomer),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/contact-customer/", async route => {
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
        await page.route(process.env.BACKEND_URL!+"/message-template/**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(messageTemplate),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/orders/**", async route => {
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
        });
        await page.route(process.env.BACKEND_URL!+"/account-order?**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(accountOrder),
                });
            }
        })                  
        await page.route(process.env.BACKEND_URL!+"/account-photo?**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET" || method == "PUT" || method == "DELETE")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(accountPhoto),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/account-file?**", async route => {
            const request = route.request();                    
            const method = request.method();
            if(method == "GET" || method == "DELETE")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(accountFile),
                });
            }
        })
        await page.route(process.env.BACKEND_URL!+"/account-certification?**", async route => {
            const request = route.request();
            const method = request.method();
            if(method == "GET" || method == "DELETE" || method == "POST")
            {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(certificates),
                });
            }
        })
        const promiseLoad = page.waitForEvent("load");
        await page.goto(process.env.FRONTEND_URL!+"/dashboard");
        await page.waitForLoadState('networkidle');
        await promiseLoad;
        const firstMenu = await page.locator('ul[data-v-inspector="layouts/simple-menu-new.vue:44:9"]').first().locator('li').nth(2);
        await firstMenu.locator('a').click({ force: true });
        const fourthMenu = await firstMenu.locator('ul').first().locator('li').first();
        await fourthMenu.locator('a').click({ force: true });
        await page.waitForURL('**/customers');
    });
    test("Lists", async ({ page }) => {
        await page.waitForSelector('h2.intro-y');
        const content = await page.locator('h2.intro-y').textContent();
        expect(content).toContain("Customers");
    }); 
    test("Open Edit", async ({ page }) => {
        await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
        await page.waitForURL('**/customers/34');
        await page.waitForLoadState('networkidle');
        const content = await page.locator('span[class="text-lg font-semibold text-left"]').textContent();
        expect(content).toContain("Esther Armstrong");
    }); 
    test("Edit", async ({ page }) => {
        await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
        await page.waitForURL('**/customers/34');   
        await page.waitForLoadState('networkidle');
        await page.locator('input#email').fill('Email Address');
        await page.locator('select#status_id').selectOption({index:3});
        await page.locator('input#phone').fill('01534616103');
        await page.locator('input#username').fill('wisoky.eulaa');
        await page.locator('input#first_name').fill('first_name');
        await page.locator('input#last_name').fill('last_name');
        await page.locator('input#profile_public').click();
        await page.locator('input#photo_id').fill('10');
        await page.locator('input#password').fill('password');
        await page.locator('input#affiliate_id').fill('10');        
        await page.locator('textarea#admin_notes').fill('Notes Test');
        await page.locator('button:text("Save")').first().click();  
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Account updated successfully");
    });
    test("Account Address", async ({ page }) => {           
        await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });     
        await page.waitForURL('**/customers/34');
        await page.waitForLoadState('networkidle'); 
        await page.locator("text=Addresses").click();
        await page.waitForSelector("text=Show Deleted Address");
        await page.waitForLoadState('networkidle');
        let cellContent = await page.getByRole("row").nth(1).getByRole('cell').nth(1).textContent();
        expect(cellContent).toContain("Dolly Labadie");
        await page.locator('input[type="checkbox"]').first().click();
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('tr.line-through');
        cellContent = await page.getByRole("row").nth(1).getByRole('cell').nth(1).textContent();
        expect(cellContent).toContain("Kazi Rahman");
        await page.getByRole("row").nth(1).locator('a').click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Account address successfully retrieve");

        await page.waitForTimeout(700)
        await page.getByRole("row").nth(2).locator('a').click();
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Account address successfully deleted");

        await page.waitForTimeout(700)
        await page.getByRole("row").nth(1).locator('input').first().click();
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Account Address updated successfully");

        await page.waitForTimeout(700)
        await page.getByRole("row").nth(1).locator('input').nth(1).click();
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Account Address updated successfully");

        await page.waitForTimeout(700)
        await page.getByRole("row").nth(1).locator('input').nth(2).click();
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Account Address updated successfully");

        await page.waitForTimeout(700);
        await page.getByRole('button', { name: 'Add Address' }).first().click();
        await page.locator('select#country_id').selectOption({index:3});
        await page.waitForLoadState('networkidle');
        await page.locator('input#is_shipping').click();
        await page.locator('input#is_billing').click();
        await page.locator('input#status').click();
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
        await page.locator('input#is_residential').click();
        await page.locator('select#state_id').selectOption({index:3});
        await page.getByRole('button', { name: 'Save' }).first().click();
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Account Address added successfully");

        await page.waitForTimeout(700);
        await page.getByRole("row").nth(1).getByRole('cell').nth(1).click();
        await page.locator('select#country_id').selectOption({index:3});
        await page.waitForLoadState('networkidle');
        await page.locator('input#is_shipping').click();
        await page.locator('input#is_billing').click();
        await page.locator('input#status').click();
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
        await page.locator('input#is_residential').click();
        await page.locator('select#state_id').selectOption({index:3});
        await page.getByRole('button', { name: 'Save' }).first().click();
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Account Address updated successfully");
    })
    test("Account Memberships", async ({ page }) => {
        await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
        await page.waitForURL('**/customers/34');
        await page.waitForLoadState('networkidle');
        await page.locator("nav").nth(2).locator('li').nth(2).click();
        await page.waitForSelector("text=Start New Membership");
        await page.waitForLoadState('networkidle');
        let tableContent = await page.locator('table').first().textContent();
        expect(tableContent).toContain("Annual Travel Membership");
        tableContent = await page.locator('table').nth(1).textContent();
        expect(tableContent).toContain("Annual Enferprise Membership");
        await page.locator('table').first().locator('a').first().click();
        await page.waitForSelector('button span:text("Unsubscribe")');
        await page.locator('button span:text("Unsubscribe")').first().click({ force: true });
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Membership successfully cancelled")
        await page.getByRole('button', { name: 'Start New Membership' }).first().click();
        await page.waitForSelector("text=Create Membership"); 
        await page.locator("input#level_id-2").click();
        await page.locator('input.dp__input').first().click();
        await page.locator('div.dp__calendar_row').first().locator('div.dp__calendar_item').nth(6).click();
        await page.locator('input.dp__input').nth(1).click();
        await page.locator('div.dp__calendar_row').nth(1).locator('div.dp__calendar_item').nth(6).click();
        await page.locator("input#cancel_active").click();
        await page.locator("input#amount_paid").fill('150');
        await page.getByRole('button', { name: 'Save' }).first().click();
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Membership created successfully");
    });
    test("Speciality", async ({ page }) => {
        await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
        await page.waitForURL('**/customers/34');
        await page.waitForLoadState('networkidle');
        await page.locator("nav").nth(2).locator('li').nth(3).click();
        await page.waitForSelector("text=Group Fitness Instructor");
        await page.waitForLoadState('networkidle');
    })
    test("Sent Emails", async ({ page }) => {
        await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
        await page.waitForURL('**/customers/34');
        await page.waitForLoadState('networkidle');
        await page.locator("nav").nth(2).locator('li').nth(4).click();
        await page.waitForSelector("text=Contact Customer");
        await page.waitForLoadState('networkidle');
        const content = await page.getByRole("row").nth(1).textContent();
        expect(content).toContain("Prof. Stan Hudson I");
        await page.getByRole('button', { name: 'Contact Customer' }).first().click();
        await page.waitForSelector("text=Load a Message Template");
        await page.locator("select#message_template_id").selectOption({index:4})
        await page.waitForLoadState('networkidle');
        const inputSubject = await page.locator("input#subject");
        await expect(inputSubject).toHaveValue("Default Site Password Reset");
        const editorData = await page.locator("div.ck-content").textContent();
        expect(editorData).toContain("Dear Esther");
        await page.getByRole('button', { name: 'Send' }).first().click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Email successfully sent to customer");
        await page.getByRole('button', { name: 'View Content' }).first().click();
        await page.waitForSelector("text=Email Content");
        const emailContent = await page.locator("div#headlessui-portal-root").textContent();
        expect(emailContent).toContain("Dear Esther");
    })
    test("Account Order", async ({ page }) => {
        await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
        await page.waitForURL('**/customers/34');
        await page.waitForLoadState('networkidle');
        await page.locator("nav").nth(2).locator('li').nth(5).click();
        await page.waitForSelector("text=11514091");
        await page.waitForLoadState('networkidle');
        await page.locator("text=11514091").click({force: true});
        await page.waitForLoadState('networkidle');
        await page.waitForSelector("text=dolores rerum est quibusdam est");
        const orderContent = await page.locator('div[role="dialog"]').textContent();
        expect(orderContent).toContain("dolores rerum est quibusdam est");
    });
    test("Account Photo", async ({ page }) => {
        await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
        await page.waitForURL('**/customers/34');
        await page.waitForLoadState('networkidle');
        await page.locator("nav").nth(2).locator('li').nth(6).click();
        await page.waitForSelector("text=voluptatem quia nulla");
        await page.getByRole("row").nth(1).getByRole('cell').locator('input').first().click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Photo Unapproved Successfully");

        await page.waitForTimeout(700)
        await page.getByRole("row").nth(1).getByRole('cell').locator('a').first().click();
        await page.waitForSelector('button span:text("Delete")');
        await page.locator('button span:text("Delete")').first().click({ force: true });
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Photo successfully deleted");
    }); 
    test("Account File", async ({ page }) => {
        await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
        await page.waitForURL('**/customers/34');
        await page.waitForLoadState('networkidle');
        await page.locator("nav").nth(2).locator('li').nth(7).click();
        await page.waitForSelector("text=NTvZ6zaZnPHv3ur2jHL9kCkfKTgodqenfcWo7H1X.jpg");

        await page.waitForTimeout(700)
        await page.getByRole("row").nth(1).getByRole('cell').locator('a').nth(1).click();
        await page.waitForSelector('button span:text("Delete")');
        await page.locator('button span:text("Delete")').first().click({ force: true });
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("File successfully deleted");
    });
    test("Account Certificate", async ({ page }) => {
        await page.getByRole("row").nth(1).getByRole('cell').nth(1).click({ force: true });
        await page.waitForURL('**/customers/34');
        await page.waitForLoadState('networkidle');
        await page.locator("nav").nth(2).locator('li').nth(8).click();
        await page.waitForSelector("text=dsdsads");
        await page.getByRole("row").nth(1).getByRole('cell').locator('input').first().click();
        await page.waitForSelector('div#swal2-html-container');
        let alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Account Certificate updated successfully");

        await page.waitForTimeout(700)
        await page.getByRole("row").nth(1).getByRole('cell').locator('a').nth(1).click();
        await page.waitForSelector('button span:text("Delete")');
        await page.locator('button span:text("Delete")').first().click({ force: true });
        await page.waitForSelector('div#swal2-html-container');
        alertText = await page.locator('div#swal2-html-container').first().textContent();
        expect(alertText).toContain("Certificate successfully deleted");
    }); 
});;