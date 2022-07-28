const webdriver = require('selenium-webdriver');
const By = webdriver.By; // mechanism to locate elems on page
const until = webdriver.until; // mechanism for conditions
const assert = require('assert');
const target_url = "http://localhost:3000";

// Driver Setup
const builder = new webdriver.Builder()
    .forBrowser('firefox');
let driver = undefined;

const testLogin = async(credentials) => {
    return driver.get(`${target_url}`)
    .then(async () => {
        await driver.sleep(2000);
        await driver.findElement(By.name("username")).sendKeys(credentials.username);
        await driver.findElement(By.name("password")).sendKeys(credentials.password);
        await driver.sleep(2000);
        return driver.findElement(By.name("username")).submit();
    })
    .then(async () => {
        await driver.wait(until.urlContains("profile"));
        const url = await driver.getCurrentUrl();
        const URLObj = new URL(url);
        assert.deepStrictEqual(URLObj.pathname, "/profile");
        return;
    });
}

const testLogout = async() => {
    return driver.get(`${target_url}`)
    .then(async() => {
        await driver.sleep(2000);
        return driver.findElement(By.linkText("Logout")).click();
    })
    .then(async () => {
        await driver.wait(until.urlContains("/login"));
        const url = await driver.getCurrentUrl();
        const URLObj = new URL(url);
        assert.deepStrictEqual(URLObj.pathname, "/login");
        return;
    })
}

const runTest = async () => {
    driver = await builder.build();
    try {  
        await testLogin({username: 'asdf', password: 'fdsa'});
        console.log("testLogin for asdf Passed");
        await testLogout();
        console.log("testLogout Passed");
        await testLogin({username: 'michaelmyers123', password: 'halloween'});
        console.log("testLogin for michaelmyers123 Passed");
        await testLogout();
        console.log("testLogout Passed");
        await testLogin({username: 'johndoe1', password: 'password1'});
        console.log("testLogin for johndoe1 Passed");
        await testLogout();
        console.log("testLogout Passed");
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        driver.quit();
        return;
    }
};

module.exports = runTest;
