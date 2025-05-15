const express = require('express');
const { chromium } = require('playwright');
const kompassScraper = require('./scrapers/kompass');
const sortlistScraper = require('./scrapers/sortlist');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const BROWSERLESS_URL = process.env.BROWSERLESS_URL;

app.get('/scrape', async (req, res) => {
    const { source, q } = req.query;
    if (!source || !q) return res.status(400).send({ error: 'Missing query or source' });

    let results = [];
    try {
        if (source === 'kompass') {
            results = await kompassScraper(q);
        } else if (source === 'sortlist') {
            results = await sortlistScraper(q);
        } else {
            return res.status(400).send({ error: 'Unsupported source' });
        }
        res.send({ source, query: q, results });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Scraping failed', details: err.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Scraper multi-source running on port ${PORT}`);
});
