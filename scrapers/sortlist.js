const { chromium } = require('playwright');
require('dotenv').config();

module.exports = async function sortlistScraper(query) {
    const browser = await chromium.connectOverCDP(process.env.BROWSERLESS_URL);
    const page = await browser.newPage();
    try {
        // URL dynamique pour les recherches générales
        const url = `https://www.sortlist.fr/search?query=${encodeURIComponent(query)}`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Vérifiez que la page est complètement chargée
        const isPageLoaded = await page.evaluate(() => document.readyState === 'complete');
        if (!isPageLoaded) {
            throw new Error("La page n'a pas complètement chargé.");
        }

        // Attente avec un délai plus long
        await page.waitForSelector('.provider-card', { timeout: 10000 });

        // Extraction des données
        const results = await page.$$eval('.provider-card', cards => {
            return cards.map(card => {
                const name = card.querySelector('.provider-card__title')?.innerText || 'Nom indisponible';
                const description = card.querySelector('.provider-card__description')?.innerText || 'Description indisponible';
                return { name, description };
            });
        });

        return results;

    } catch (error) {
        console.error("Erreur dans le scraper :", error);
        throw error; // Renvoyer l'erreur pour la loguer correctement
    } finally {
        await browser.close(); // Fermer le navigateur même en cas d'erreur
    }
};
