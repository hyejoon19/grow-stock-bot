
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
    $('.seed-item').each((i, el) => {
      const name = $(el).find('.name').text().trim();
      const count = $(el).find('.count').text().trim();
      seeds.push({ name, count });
    });

    const eggs = [];
    $('.egg-item').each((i, el) => {
      const name = $(el).text().trim();
      eggs.push(name);
    });

    const gears = [];
    $('.gear-item').each((i, el) => {
      const name = $(el).find('.name').text().trim();
      const count = $(el).find('.count').text().trim();
      gears.push({ name, count });
    });

    res.json({ seeds, eggs, gears });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
