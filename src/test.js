async function setUp(context, commands) {
    let webdriver;
    let driver;
    try {
        webdriver = context.selenium.webdriver;
        driver = context.selenium.driver;
        const { until, By } = webdriver;
        // driver.manage().window().maximize();
        const deviceXpath = "//*[@data-analyticstrack='gridwall-product-tile']";
        const continueCTAXpath = "//*[@data-analyticstrack='pdp-addToCart-cta']";
        const newCustomerCTAXpath = "//*[@data-testid='newCustomerCta']";
        const modalCloseBtnXpath = "//*[@data-testid='modal-close-button']";
        const appleTabXpath = "//*[@data-analyticstrack='tab-Apple']";
        const REVIEWSTAB = "//*[@id='REVIEWSTAB']";
        const FILTREDCHIPS = "//*[@id='renderSelectedFilters']";
        const FAQsTAB = "//*[@id='FAQsTAB']";
        const eleLocateTimeOut = 40000;
        const GWPageName = 'Gridwall';
        const FILTEREDGWPAGE = 'GRIDWALL_FILTER_PAGE'
        const PDPPageName = 'PDP'

        await commands.cache.clear();
        await commands.navigate('https://www.verizon.com');
        let domLoadTryLeftGW = 50;
        const waitUntilDomLoadGW = () =>
            new Promise((resolve, reject) => {
                const timer = setInterval(async () => {
                    domLoadTryLeftGW--
                    if (await driver.executeScript("return document.readyState") !== 'loading') {
                        clearInterval(timer);
                        resolve(true);
                    }
                    if (domLoadTryLeftGW < 1) {
                        clearInterval(timer);
                        reject(new Error('Max DOM Load wait reached'))
                    }
                }, 1000);
            });
        await commands.measure.start('https://www.verizon.com/smartphones/', GWPageName);
        await waitUntilDomLoadGW();
        console.log(`${GWPageName} Page State`, await driver.executeScript("return document.readyState"))
        await driver.wait(until.elementLocated({ xpath: appleTabXpath }), eleLocateTimeOut);
        await commands.click.byXpath(appleTabXpath);
        let domLoadTryLeftFilterGW = 50;
        const waitUntilDomLoadFilterGW = () =>
            new Promise((resolve, reject) => {
                const timer = setInterval(async () => {
                    domLoadTryLeftFilterGW--
                    if (await driver.executeScript("return document.readyState") !== 'loading') {
                        clearInterval(timer);
                        resolve(true);
                    }
                    if (domLoadTryLeftFilterGW < 1) {
                        clearInterval(timer);
                        reject(new Error('Max DOM Load wait reached'))
                    }
                }, 1000);
            });
        await waitUntilDomLoadFilterGW();
        await driver.wait(until.elementLocated({ xpath: FILTREDCHIPS }), eleLocateTimeOut);
        console.log(`${FILTEREDGWPAGE} Page State`, await driver.executeScript("return document.readyState"))
        await driver.wait(until.elementLocated({ xpath: deviceXpath }), eleLocateTimeOut);
        await commands.click.byXpath(deviceXpath);
        await driver.wait(until.elementLocated({ xpath: continueCTAXpath }), eleLocateTimeOut);
        await commands.measure.start(PDPPageName);
        let domLoadTryLeftPDP = 50;
        const waitUntilDomLoadPDP = () =>
            new Promise((resolve, reject) => {
                const timer = setInterval(async () => {
                    domLoadTryLeftPDP--
                    if (await driver.executeScript("return document.readyState") !== 'loading') {
                        clearInterval(timer);
                        resolve(true);
                    }
                    if (domLoadTryLeftPDP < 1) {
                        clearInterval(timer);
                        reject(new Error('Max DOM Load wait reached'))
                    }
                }, 1000);
            });

        await waitUntilDomLoadPDP();
        console.log(`${PDPPageName} Page State`, await driver.executeScript("return document.readyState"))
        await driver.wait(until.elementLocated({ xpath: continueCTAXpath }), eleLocateTimeOut);
        const continueEle = driver.findElement(By.xpath(continueCTAXpath));
        await commands.wait.byTime(3000);
        const isContinueBtnEnabled = await continueEle.isEnabled();
        console.log('Is Continue Button Enabled', isContinueBtnEnabled)
        if (isContinueBtnEnabled) {
            await commands.js.run('(document.getElementById("cta-btn").scrollIntoView())');
            await commands.click.byXpath(continueCTAXpath);
            await commands.wait.byTime(500);
            await driver.wait(until.elementLocated({ xpath: newCustomerCTAXpath }), eleLocateTimeOut);
            await commands.click.byXpath(newCustomerCTAXpath);
            await commands.wait.byTime(500);
            await driver.wait(until.elementLocated({ xpath: modalCloseBtnXpath }), eleLocateTimeOut);
            await commands.click.byXpath(modalCloseBtnXpath);
            await commands.wait.byTime(3000);
        }
        else {
            await driver.wait(until.elementLocated({ xpath: REVIEWSTAB }), eleLocateTimeOut);
            await commands.js.run('(document.getElementById("REVIEWSTAB").scrollIntoView())');
            await commands.click.byXpath(REVIEWSTAB);
            await commands.wait.byTime(500);
            await commands.click.byXpath(FAQsTAB);
            await commands.wait.byTime(3000);
        }

        return await commands.measure.stop();
    }
    catch (e) {
        await commands.measure.stop();
        console.info("...........Error While Loading Page .............")
        console.error(e)
        driver.close();
        throw e;
    }

};

async function perfTest(context, commands) {
    let webdriver;
    let driver;
    try {
        webdriver = context.selenium.webdriver;
        driver = context.selenium.driver;
    }
    catch (e) {
        console.error(e)
        driver.close();
        throw e;
    }
};

async function tearDown(context, commands) {
    let webdriver;
    let driver;
    try {
        webdriver = context.selenium.webdriver;
        driver = context.selenium.driver;
        console.info(context.options.resultDir);
    }
    catch (e) {
        console.error(e)
        driver.close();
        throw e;
    }
};

module.exports = {
    setUp: setUp,
    tearDown: tearDown,
    test: perfTest
};

