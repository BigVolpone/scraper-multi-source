const { chromium } = require('playwright');
require('dotenv').config();

module.exports = async function sortlistScraper(query) {
    const browser = await chromium.connectOverCDP(process.env.BROWSERLESS_URL);
    const page = await browser.newPage();

    // URL Générale pour toutes les recherches
    const url = `https://www.sortlist.fr/search?query=${encodeURIComponent(query)}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Attendre que les éléments soient chargés
    await page.waitForSelector('.provider-card');

    // Extraction des données générales
    const results = await page.$$eval('.provider-card', cards => {
        return cards.map(card => {
            const name = card.querySelector('.provider-card__title')?.innerText || 'Nom indisponible';
            const description = card.querySelector('.provider-card__description')?.innerText || 'Description indisponible';
            return { name, description };
        });
    });

    await browser.close();
    return results;
};
