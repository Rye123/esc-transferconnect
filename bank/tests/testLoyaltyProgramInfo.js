const assert = require('assert');
const { Builder, By, Key, until } = require('selenium-webdriver');

const testLoyaltyPrograms = async (credentials) => {
    let driver = await new Builder().forBrowser('firefox').build();
    return driver.get('http://localhost:3000')
        .then(async () => {
            await driver.sleep(2000);
            await driver.findElement(By.name("username")).sendKeys(credentials.username);
            await driver.findElement(By.name("password")).sendKeys(credentials.password);
            return driver.findElement(By.name("username")).submit();
        })
        .then(async () => {
            await driver.wait(until.urlContains("profile"));
            const url = await driver.getCurrentUrl();
            const URLObj = new URL(url);
            assert.deepStrictEqual(URLObj.pathname, "/profile");
            return;
        })
        .then(async () => {
            await driver.sleep(2000);
            await driver.findElement(By.linkText("Loyalty Programs")).click();
            await driver.wait(until.urlContains("loyalty_programs"));
            const url = await driver.getCurrentUrl();
            const URLObj = new URL(url);
            assert.deepStrictEqual(URLObj.pathname, "/loyalty_programs");
            return;
        })
        .then(async () => {
            await driver.sleep(2000);
            await driver.findElement(By.className("view_item")).click();
            await driver.wait(until.urlContains("/loyalty_programs"));
            const url = await driver.getCurrentUrl();
            const URLObj = new URL(url);
            assert.deepStrictEqual(URLObj.pathname, "/loyalty_programs/loyalty_program");
            return;
        });
}

const runTest = async () => {
    let driver = await new Builder().forBrowser('firefox').build();
    try {
        await testLoyaltyPrograms({ username: 'asdf', password: 'fdsa' });
        console.log("Loyalty Program Info Passed");
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        driver.quit();
        return;
    }
};

module.exports = runTest;