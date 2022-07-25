/* Driver Setup */
const webdriver = require('selenium-webdriver');
const By = webdriver.By; // mechanism to locate elems on page
const until = webdriver.until; // mechanism for conditions
const driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();
const assert = require('assert');

/* Axios Setup */
const axios = require('axios');
const target_url = "http://localhost:3000";

// Browser State Setup
const login = async() => {
    const credentials = {
        user: 'asdf',
        password: 'fdsa'
    };
    return driver.get(`${target_url}`)
    .then(async () => {
        await driver.sleep(1000);
        await driver.findElement(By.name("username")).sendKeys(credentials.user);
        await driver.findElement(By.name("password")).sendKeys(credentials.password);
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


(async () => {
    try {
        // Login first
        await login();
    } catch (error) {
        console.error(error);
    }
    driver.quit();
})();