const Trending = require("./scraper/githubScraper");

async function testScraper() {
    console.log('Testing GitHub Trending Scraper...\n');

    const scraper = new Trending.Scraper();

    try {
        console.log('Fetching trending JavaScript repositories...');
        const repos = await scraper.scrapeTrendingReposFullInfo('javascript');

        console.log(`\nFound ${repos.length} trending repositories\n`);

        if (repos.length > 0) {
            console.log('First 3 repositories:');
            repos.slice(0, 3).forEach((repo, index) => {
                console.log(`\n${index + 1}. ${repo.owner}/${repo.name}`);
                console.log(`   Description: ${repo.description || 'N/A'}`);
                console.log(`   Language: ${repo.language || 'N/A'}`);
                console.log(`   Stars: ${repo.allStars || 'N/A'}`);
                console.log(`   Today's Stars: ${repo.todaysStars || 'N/A'}`);
            });

            console.log('\n✅ Scraper test successful!');
        } else {
            console.log('⚠️  No repositories found. The scraper may need adjustment.');
        }
    } catch (error) {
        console.error('❌ Scraper test failed:', error.message);
        console.error(error.stack);
    }
}

testScraper();
