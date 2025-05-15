const { chromium } = require('playwright');
require('dotenv').config();

module.exports = async function kompassScraper(query) {
    const browser = await chromium.connectOverCDP(process.env.BROWSERLESS_URL);
    const page = await browser.newPage();
    const url = `https://fr.kompass.com/fr/searchCompanies?searchType=COMPANY&text=${encodeURIComponent(query)}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const results = await page.$$eval('.search-result', nodes => {
        return nodes.map(el => {
            const name = el.querySelector('.search-result__title a')?.innerText.trim() || '';
            const link = el.querySelector('.search-result__title a')?.href || '';
            const description = el.querySelector('.search-result__description')?.innerText.trim() || '';
            return { name, link, description };
        });
    });

    await browser.close();
    return results;
};
