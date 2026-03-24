import { Router } from "express";
import { SearchClient, Config } from "coze-coding-dev-sdk";

const router = Router();

// 搜索GitHub上的卡牌拖动相关开源项目
router.get('/search-projects', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const config = new Config();
    const client = new SearchClient(config);

    // 使用webSearch进行基本搜索
    const response = await client.webSearch(
      `${query} github react native card drag gesture handler`,
      10,
      true
    );

    // 过滤出GitHub仓库链接
    const githubRepos = response.web_items?.filter(item => {
      return item.url && item.url.includes('github.com');
    }).map(item => ({
      title: item.title,
      url: item.url,
      snippet: item.snippet,
      summary: item.summary,
      siteName: item.site_name,
    })) || [];

    res.json({
      summary: response.summary,
      repositories: githubRepos,
      total: githubRepos.length,
      allResults: response.web_items?.map(item => ({
        title: item.title,
        url: item.url,
        siteName: item.site_name,
      })),
    });
  } catch (error) {
    console.error('GitHub search error:', error);
    res.status(500).json({ error: 'Failed to search GitHub repositories' });
  }
});

export default router;
