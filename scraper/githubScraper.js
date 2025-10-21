const request = require('request');
const cheerio = require('cheerio');

class GitHubTrendingScraper {
    constructor(config = {}) {
        this.config = config;
        this.baseUrl = 'https://github.com/trending';
    }

    /**
     * Fetch the GitHub trending page HTML using request module
     * @param {string} language - Programming language filter (optional)
     * @returns {Promise<string>} HTML content
     */
    fetchTrendingPage(language) {
        let url = this.baseUrl;
        if (language) {
            url += `?l=${language}`;
        }

        const opts = {
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        };

        if (this.config.proxy) {
            opts.proxy = this.config.proxy;
        }

        return new Promise((resolve, reject) => {
            request(opts, (err, res, body) => {
                if (err) {
                    console.error('Error fetching trending page:', err.message);
                    reject(err);
                    return;
                }
                if (res.statusCode !== 200) {
                    console.error(`Invalid status: ${res.statusCode}`);
                    reject(new Error(`Invalid status: ${res.statusCode}`));
                    return;
                }
                resolve(body);
            });
        });
    }

    /**
     * Scrape trending repositories with full information
     * @param {string} language - Programming language filter (optional)
     * @returns {Promise<Array>} Array of repository objects
     */
    async scrapeTrendingReposFullInfo(language) {
        try {
            const html = await this.fetchTrendingPage(language);
            const $ = cheerio.load(html);
            const repos = [];

            // GitHub trending uses article.Box-row for each repository
            const $items = $('article.Box-row');

            if ($items.length === 0) {
                console.warn('No repository items found');
                return [];
            }

            console.log(`Found ${$items.length} trending repositories`);

            $items.each((index, element) => {
                const $repo = $(element);

                try {
                    // Extract repository owner and name from h2 > a
                    const repoLink = $repo.find('h2 a').first().attr('href');
                    if (!repoLink) return;

                    const parts = repoLink.replace(/^\//, '').split('/');
                    if (parts.length < 2) return;

                    const owner = parts[0];
                    const name = parts[1];

                    // Extract description
                    let description = $repo.find('p').first().text().trim();
                    if (!description || description.length === 0) {
                        description = null;
                    }

                    // Extract programming language
                    let lang = null;
                    const langElement = $repo.find('span[itemprop="programmingLanguage"]');
                    if (langElement.length > 0) {
                        lang = langElement.text().trim();
                    }

                    // Extract total stars from the stargazers link
                    let allStars = null;
                    const starsLink = $repo.find('a[href$="/stargazers"]');
                    if (starsLink.length > 0) {
                        allStars = starsLink.text().trim().replace(/\s+/g, ' ');
                    }

                    // Extract today's stars from the span with stars today info
                    let todaysStars = null;
                    const $spans = $repo.find('span.d-inline-block');
                    $spans.each((i, span) => {
                        const text = $(span).text();
                        if (text.includes('stars today') || text.includes('star today')) {
                            const match = text.match(/[\d,]+/);
                            if (match) {
                                todaysStars = match[0];
                            }
                        }
                    });

                    repos.push({
                        index,
                        owner,
                        name,
                        description,
                        language: lang,
                        allStars,
                        todaysStars
                    });
                } catch (err) {
                    console.error('Error parsing repository:', err.message);
                }
            });

            console.log(`Successfully scraped ${repos.length} repositories`);
            return repos;
        } catch (error) {
            console.error('Error scraping trending repos:', error.message);
            throw error;
        }
    }

    /**
     * Scrape basic trending repositories info (owner and name only)
     * @param {string} language - Programming language filter (optional)
     * @returns {Promise<Array>} Array of basic repository objects
     */
    async scrapeTrendingRepos(language) {
        const fullInfo = await this.scrapeTrendingReposFullInfo(language);
        return fullInfo.map(repo => ({
            owner: repo.owner,
            name: repo.name
        }));
    }
}

module.exports = {
    Scraper: GitHubTrendingScraper
};
