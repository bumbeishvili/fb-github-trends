const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const http = require('http');

class GitHubTrendingScraper {
    constructor(config = {}) {
        this.config = config;
        this.baseUrl = 'https://github.com/trending';
    }

    /**
     * Fetch the GitHub trending page HTML using axios with retry logic
     * @param {string} language - Programming language filter (optional)
     * @param {number} retries - Number of retries (default: 3)
     * @returns {Promise<string>} HTML content
     */
    async fetchTrendingPage(language, retries = 3) {
        let url = this.baseUrl;
        if (language) {
            url += `?l=${language}`;
        }

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.9',
                    },
                    timeout: 15000,
                    maxRedirects: 0,
                    validateStatus: (status) => status === 200
                });

                return response.data;
            } catch (error) {
                if (attempt === retries) {
                    console.error(`Failed to fetch trending page after ${retries} attempts:`, error.message);
                    throw error;
                }
                console.log(`Attempt ${attempt} failed, retrying... (${error.message})`);
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
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

            // Try multiple selectors for different GitHub layouts
            const containerSelectors = ['article.Box-row', 'article', '.Box-row', 'li.Box-row'];
            let $items = $();

            for (const selector of containerSelectors) {
                $items = $(selector);
                if ($items.length > 0) {
                    console.log(`Found ${$items.length} items using selector: ${selector}`);
                    break;
                }
            }

            if ($items.length === 0) {
                console.warn('No repository items found with any selector');
                return [];
            }

            $items.each((index, element) => {
                const $repo = $(element);

                try {
                    // Extract repository owner and name - try multiple selectors
                    let repoLink = $repo.find('h2 a').first().attr('href');
                    if (!repoLink) {
                        repoLink = $repo.find('h1 a').first().attr('href');
                    }
                    if (!repoLink) {
                        repoLink = $repo.find('a[href^="/"]').first().attr('href');
                    }
                    if (!repoLink) return;

                    const parts = repoLink.replace(/^\//, '').split('/');
                    if (parts.length < 2) return;

                    const owner = parts[0];
                    const name = parts[1];

                    // Extract description - try multiple selectors
                    let description = $repo.find('p.col-9').text().trim();
                    if (!description) {
                        description = $repo.find('p').first().text().trim();
                    }
                    if (!description || description.length === 0) {
                        description = null;
                    }

                    // Extract programming language
                    let lang = null;
                    let langElement = $repo.find('span[itemprop="programmingLanguage"]');
                    if (langElement.length === 0) {
                        langElement = $repo.find('[data-filterable-current-language]');
                    }
                    if (langElement.length > 0) {
                        lang = langElement.text().trim();
                    }

                    // Extract total stars - try multiple approaches
                    let allStars = null;
                    let starsElement = $repo.find('svg.octicon-star').parent();
                    if (starsElement.length === 0) {
                        starsElement = $repo.find('a[href$="/stargazers"]');
                    }
                    if (starsElement.length > 0) {
                        allStars = starsElement.text().trim().replace(/\s+/g, ' ');
                    }

                    // Extract today's stars (stars gained in the period)
                    let todaysStars = null;
                    const todayStarsElement = $repo.find('span.d-inline-block.float-sm-right, span.float-sm-right');
                    if (todayStarsElement.length > 0) {
                        const text = todayStarsElement.text().trim();
                        const match = text.match(/[\d,]+/);
                        if (match) {
                            todaysStars = match[0];
                        }
                    }

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
