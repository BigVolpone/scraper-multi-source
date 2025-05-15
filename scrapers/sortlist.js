const { chromium } = require('playwright');
require('dotenv').config();

module.exports = async function sortlistScraper(query) {
    const browser = await chromium.launch({ headless: true }); // Forcer le mode headless
    const page = await browser.newPage();

    try {
        // URL pour la recherche
        const url = `https://www.sortlist.fr/search?query=${encodeURIComponent(query)}`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Extraction des données
        const results = await page.$$eval('.provider-card', cards => 
            cards.map(card => ({
                name: card.querySelector('.provider-card__title')?.innerText || 'Nom indisponible',
                description: card.querySelector('.provider-card__description')?.innerText || 'Description indisponible',
            }))
        );

        return results;

    } catch (error) {
        console.error("Erreur dans le scraper :", error);
        throw error;

    } finally {
        await browser.close();
    }
};
