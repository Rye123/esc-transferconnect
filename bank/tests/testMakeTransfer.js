const assert = require('assert');
const {Builder, By, Key, until} = require('selenium-webdriver');

const testLoyaltyPrograms = async(credentials) => {
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
    .then (async () => {
        await driver.sleep(2000);
        await driver.findElement(By.linkText("Loyalty Programs")).click();
        await driver.wait(until.urlContains("loyalty_programs"));
        const url = await driver.getCurrentUrl();
        const URLObj = new URL(url);
        assert.deepStrictEqual(URLObj.pathname, "/loyalty_programs");
        return;
    })
    .then (async () => {
        await driver.sleep(2000);
        await driver.findElement(By.className("btn")).click();
        await driver.wait(until.urlContains("make_transfer"));
        const url = await driver.getCurrentUrl();
        const URLObj = new URL(url);
        assert.notDeepStrictEqual(URLObj.pathname, "/make_transfer");
        return;
    })
    .then (async () => {
        await driver.sleep(2000);
        await driver.findElement(By.className("input")).sendKeys(25);
        await driver.sleep(2000);
        await driver.findElement(By.className("input")).submit();
        await driver.wait(until.urlContains("transfers"));
        const url = await driver.getCurrentUrl();
        const URLObj = new URL(url);
        assert.notDeepStrictEqual(URLObj.pathname, "/transfers");
        return;
    })
}

const runTest = async () => {
    let driver = await new Builder().forBrowser('firefox').build();
    try {  
        await testLoyaltyPrograms({username: 'asdf', password: 'fdsa'});
        console.log("Make a transfer Passed");
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        driver.quit();
        return;
    }
};

module.exports = runTest;