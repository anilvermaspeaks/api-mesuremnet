async function setUp(context, commands) {
    let webdriver;
    let driver;
    try {
        webdriver = context.selenium.webdriver;
        driver = context.selenium.driver;
        const { until, By } = webdriver;
        // driver.manage().window().maximize();
        const deviceXpath = "//*[@data-analyticstrack='gridwall-product-tile']";
        const continueCTAXpath = "//*[@id='cta-btn']/div[1]/button";
        const newCustomerCTAXpath = "//*[@data-testid='newCustomerCta']";
        const modalCloseBtnXpath = "//*[@data-testid='modal-close-button']";
        const deviceNodeAvailCondition = until.elementLocated({ xpath: deviceXpath });
        const continueNodeAvailCondition = until.elementLocated({ xpath: continueCTAXpath });
        const newCustomerNodeAvailCondition = until.elementLocated({ xpath: newCustomerCTAXpath });
        const closeBtnNodeAvailCondition = until.elementLocated({ xpath: modalCloseBtnXpath });
        const eleLocateTimeOut = 20000;
        const GWPageName = 'Gridwall';
        const PDPPageName = 'PDP'

        await commands.cache.clear();
        await commands.measure.start('https://www.verizon.com/smartphones/', GWPageName);
        console.log("gw measire")
        await driver.wait(deviceNodeAvailCondition, eleLocateTimeOut);
        await commands.click.byXpath(deviceXpath);
        await commands.measure.start(PDPPageName);
        let domLoadTryLeft = 50;
        const waitUntilDomLoad = () =>
            new Promise((resolve, reject) => {
                const timer = setInterval(async () => {
                    domLoadTryLeft--
                    if (await driver.executeScript("return document.readyState") === 'interactive') {
                        clearInterval(timer);
                        resolve(true);
                    }
                    if (domLoadTryLeft < 1) {
                        clearInterval(timer);
                        reject(new Error('Max DOM Load wait reached'))
                    }
                }, 1000);
            });

        await waitUntilDomLoad();
        console.log('...........DOM EVENTS AFTER DOM CONTENT LOADED..............');
        await driver.wait(continueNodeAvailCondition, eleLocateTimeOut);
        await commands.js.run('(document.getElementById("cta-btn").scrollIntoView()) ');
        await commands.click.byXpathAndWait(continueCTAXpath);
        await driver.wait(newCustomerNodeAvailCondition, eleLocateTimeOut);
        await commands.click.byXpathAndWait(newCustomerCTAXpath);
        await driver.wait(closeBtnNodeAvailCondition, eleLocateTimeOut);
        await commands.click.byXpathAndWait(modalCloseBtnXpath);
        return await commands.measure.stop();
    }
    catch (e) {
        console.info("...........Error While Loading Page .............")
        console.error(e)
        driver.close();
        throw e;
    }

};

async function perfTest(context, _commands) {
    let webdriver;
    let driver;
    try {
        webdriver = context.selenium.webdriver;
        driver = context.selenium.driver;
        console.log("inside script for custom metrics")
    }
    catch (e) {
        console.error(e)
        driver.close();
        throw e;
    }
};

async function tearDown(context, _commands) {
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

