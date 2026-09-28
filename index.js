const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const CATEGORY_NAMES = {
  business: 'Бизнес',
  economic: 'Экономика',
  finances: 'Финансы',
  politics: 'Политика'
};


const RSS_BASE = 'https://www.vedomosti.ru/rss/rubric';

app.get('/:count/news/for/:category', async (req, res) => {
  const { count, category } = req.params;
  const newsCount = parseInt(count, 10);


  if (isNaN(newsCount) || newsCount <= 0) {
    return res.status(400).send('Число новостей должно быть целым положительным числом');
  }

  if (!CATEGORY_NAMES[category]) {
    return res.status(400).send(
      `Недопустимая категория. Доступны: ${Object.keys(CATEGORY_NAMES).join(', ')}`
    );
  }


  const rssUrl = `${RSS_BASE}/${category}`;

  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

  try {
    
    const response = await axios.get(apiUrl);

    if (response.data.status !== 'ok') {
      throw new Error(response.data.message || 'rss2json вернул ошибку');
    }

    const items = response.data.items || [];
    const news = items.slice(0, newsCount).map(item => ({
      title: item.title,
      description: item.description
    }));

    
    const categoryTitle = CATEGORY_NAMES[category];

    res.render('news', {
      count: newsCount,
      categoryTitle,
      news
    });
  } catch (error) {
    console.error('Ошибка при получении RSS:', error.message);
    res.status(500).send('Не удалось загрузить новости. Попробуйте позже.');
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});





app.listen(localhost,()=>{console.log('Сервер запущен');});
