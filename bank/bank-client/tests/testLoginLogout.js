const webdriver = require('selenium-webdriver');
const By = webdriver.By; // mechanism to locate elems on page
const until = webdriver.until; // mechanism for conditions
const assert = require('assert');
const target_url = "http://localhost:3000";

// Driver Setup
const driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

const testLogin = async() => {
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

const testLogout = async() => {
    return driver.get(`${target_url}`)
    .then(() => {
        return driver.findElement(By.name("navlink_logout")).click();
    })
    .then(async () => {
        await driver.wait(until.urlContains("/login"));
        const url = await driver.getCurrentUrl();
        const URLObj = new URL(url);
        assert.deepStrictEqual(URLObj.pathname, "/login");
        return;
    })
}

(async () => {
    try {  
        await testLogin();
        console.log("testLogin Passed");
        await testLogout();
        console.log("testLogout Passed");
    } catch (error) {
        console.error(error);
    }
    driver.quit();
})();
