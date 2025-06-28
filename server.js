
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/grow-stock', async (req, res) => {
  try {
    const response = await axios.get('https://growagarden.gg/stocks', {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(response.data);

    const seeds = [];
    $('[data-stock-group="씨앗"] .stock-card').each((i, el) => {
      const name = $(el).find('.stock-name').text().trim();
      const count = $(el).find('.stock-count').text().trim();
      if (name && count) seeds.push({ name, count });
    });

    const eggs = [];
    $('[data-stock-group="에그"] .stock-card').each((i, el) => {
      const name = $(el).find('.stock-name').text().trim();
      if (name) eggs.push(name);
    });

    const gears = [];
    $('[data-stock-group="기어샵"] .stock-card').each((i, el) => {
      const name = $(el).find('.stock-name').text().trim();
      const count = $(el).find('.stock-count').text().trim();
      if (name && count) gears.push({ name, count });
    });

    res.json({ seeds, eggs, gears });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Grow Stock Bot is running');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
