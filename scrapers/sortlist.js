const { chromium } = require('playwright');
require('dotenv').config();

module.exports = async function sortlistScraper(query) {
    const browser = await chromium.launch({ headless: false }); // Mode non-headless pour debugging
    const page = await browser.newPage();

    try {
        // Simule un vrai navigateur
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36');

        // URL pour la recherche
        const url = `https://www.sortlist.fr/search?query=${encodeURIComponent(query)}`;
        console.log('Ouverture de la page...');
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Vérifie si la page a chargé
        const isPageLoaded = await page.evaluate(() => document.readyState === 'complete');
        if (!isPageLoaded) {
            throw new Error("La page n'a pas complètement chargé.");
        }

        console.log('Chargement terminé, attente des cartes...');
        await page.waitForSelector('.provider-card', { timeout: 15000 });

        // Extraction des données
        const results = await page.$$eval('.provider-card', cards => {
            return cards.map(card => {
                const name = card.querySelector('.provider-card__title')?.innerText || 'Nom indisponible';
                const description = card.querySelector('.provider-card__description')?.innerText || 'Description indisponible';
                return { name, description };
            });
        });

        console.log('Extraction terminée.');
        return results;

    } catch (error) {
        console.error("Erreur dans le scraper :", error);
        throw error;

    } finally {
        await browser.close();
    }
};
