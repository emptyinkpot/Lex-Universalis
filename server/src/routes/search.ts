import express from 'express';
import { SearchClient, Config } from 'coze-coding-dev-sdk';

const router = express.Router();

// 搜索 React Native 相关库
router.get('/search-libs', async (req, res) => {
  try {
    const { type } = req.query;

    const config = new Config();
    const client = new SearchClient(config);

    let query = '';
    let results: any[] = [];

    if (type === 'drag') {
      query = 'React Native card drag drop gesture handler library 2024';
    } else if (type === 'particles') {
      query = 'React Native particle effects animation library 2024';
    } else if (type === 'animations') {
      query = 'React Native game animation effects library 2024';
    } else if (type === 'all') {
      query = 'React Native card game animation particle drag drop library 2024';
    } else {
      query = 'React Native card game libraries';
    }

    const response = await client.webSearch(query, 15, true);

    if (response.web_items) {
      results = response.web_items.map(item => ({
        title: item.title,
        url: item.url,
        snippet: item.snippet,
        siteName: item.site_name,
        summary: item.summary,
      }));
    }

    res.json({
      success: true,
      type,
      summary: response.summary,
      results,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
