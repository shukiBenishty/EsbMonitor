var assert = require('assert'),
//test = require('selenium-webdriver/testing'),
webdriver = require('selenium-webdriver');
import chai, { expect, should } from 'chai';
import SauceLabs from 'saucelabs';

let driver;

let username = 'olegkleiman' // process.env.SAUCE_USER;
let accessKey = '6fbb18bd-5926-401d-9c6b-d50de081e752'; // process.env.SAUCE_KEY;
let password = 'dfnc94^*';
let testName = 'Sauce Login Test'

let saucelabs = new SauceLabs({ username: username, password: password });

describe('Login Tests', () => {

   let sessionId;

   before( async() => {

     driver = await new webdriver.Builder()
     .withCapabilities(webdriver.Capabilities.chrome())
     //.usingServer("https://"+ username +":"+ accessKey +"@ondemand.saucelabs.com/wd/hub")
     .build();

     const session = await driver.getSession();
     sessionId = session.id_;
     console.log(`New sauce job to be created: ${sessionId}`);

     await saucelabs.updateJob(sessionId, {
       name: testName,
       public: 'public',
     });

   })

   it('Launch and Login', async() => {

    //this.timeout(5000);

    driver.get('http://mydigitel.tel-aviv.gov.il/');
    // driver.manage().addCookie({
    //   name: 'cookie-1',
    //   value: 'cookieValue'
    // });
    // const loadedCookies = await driver.manage().getCookies();
    // for(let cookie in loadedCookies) {
    //   console.log(`Loaded cookie: ${cookie}`);
    // }


    let elem = await driver.findElement(webdriver.By.name('UserName'));
    elem.sendKeys("000000018");

    elem = await driver.findElement(webdriver.By.name("Password"));
    elem.sendKeys("test123");

    elem = await driver.findElement(webdriver.By.css("span[class=submit]"));
    await elem.click();
    // Page be re-loaded after click(),
    // so we need to await click() and re-enforce locators

      //driver.wait(webdriver.until.elementLocated(webdriver.By.id("errorText")), 10000);

      elem = await driver.findElement(webdriver.By.id("errorText"));
      const text = await elem.getText();
      console.log(`Error Text: ${text}`);

  });

  after( async() => {

    // saucelabs.updateJob(sessionId, {
    //   name: testName,
    //   passed: true,
    // });

    await driver.quit()
    .then( () => console.log('DONE') )
    .catch( (err) => console.error(err));

  })
});
