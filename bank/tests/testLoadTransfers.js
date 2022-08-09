const assert = require('assert');
const { Builder, By, Key, until } = require('selenium-webdriver');

const testLoadTransfers = async (credentials) => {
    let driver = await new Builder().forBrowser('firefox').build();
    return driver.get('http://localhost:3000')
        .then(async () => {
            await driver.sleep(1000);
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
            await driver.findElement(By.linkText("Transfers")).click();
            await driver.wait(until.urlContains("transfers"));
            const url = await driver.getCurrentUrl();
            const URLObj = new URL(url);
            assert.deepStrictEqual(URLObj.pathname, "/transfers");
            return;
        })
        .then(async () => {
            await driver.sleep(2000);
            await driver.findElement(By.className("btn")).click();
            await driver.wait(until.urlContains("transfers"));
            const url = await driver.getCurrentUrl();
            const URLObj = new URL(url);
            assert.notDeepStrictEqual(URLObj.pathname, "/transfers");
            return;
        });
}

const runTest = async () => {
    let driver = await new Builder().forBrowser('firefox').build();
    try {
        await testLoadTransfers({ username: 'asdf', password: 'fdsa' });
        console.log("Load Transfers Passed");
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        driver.quit();
        return;
    }
};

module.exports = runTest;