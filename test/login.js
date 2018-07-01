import webdriver from 'selenium-webdriver';
import SauceLabs from 'saucelabs';

let driver;

const username = 'olegkleiman' // process.env.SAUCE_USER;
const accessKey = '6fbb18bd-5926-401d-9c6b-d50de081e752'; // process.env.SAUCE_KEY;
const password = 'dfnc94^*';
const testName = 'Update Customer';

let saucelabs = new SauceLabs({ username: username, password: password });

describe('Login Tests', () => {

  let seessionId;

  before( async() => {

    driver = await new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities.chrome())
            //.usingServer("https://"+ username +":"+ accessKey +"@ondemand.saucelabs.com/wd/hub")
            .build();

    const session = await driver.getSession();
    seessionId = session.id_;
    console.log(`Session id: ${seessionId}`);

    // await saucelabs.updateJob(sessionId, {
    //   name: testName,
    //   public: 'public',
    // });

  })

  it('Launch and Login', async() => {

    //driver.get('http://mydigitel.tel-aviv.gov.il/');
    driver.get('https://mydigitelpre13.tel-aviv.gov.il/Pages/ProfileUpdate.aspx');

    let elem = await driver.findElement(webdriver.By.name('UserName'));
    elem.sendKeys('030614507');

    elem = await driver.findElement(webdriver.By.name('Password'));
    await elem.sendKeys('tyty1616');

    elem = await driver.findElement(webdriver.By.css('span[class=submit]'));
    await elem.click();
    // Page be re-loaded after click(),
    // so we need to await click() and re-enforce locators    

     //driver.wait(webdriver.until.elementLocated(webdriver.By.id("errorText")), 10000);
     // elem = await driver.findElement(webdriver.By.id("errorText"));
     // const text = await elem.getText();
     // console.log(`Error Text: ${text}`);

    elem = await driver.findElement(webdriver.By.id('ctl00_ctl65_g_088dab0c_3a75_4d86_a248_4203f4a4c226_ctl00_txtEmail'));
    await elem.clear();
    await elem.sendKeys('oleg_kleyman@hotmail.com');

    elem = await driver.findElement(webdriver.By.css('#ctl00_ctl65_g_088dab0c_3a75_4d86_a248_4203f4a4c226_ctl01_pnlButtons > a'));
    await elem.click();
  })

  after( async() => {

    // saucelabs.updateJob(sessionId, {
    //   name: testName,
    //   passed: true,
    // });

    // await driver.quit()
    // .then( () => console.log('QUIT') )
    // .catch( (err) => console.log(err) );

  })

});
