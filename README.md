# Github trends on Facebook

Automatically post Github trends on Facebook page

## Recent Updates (2025)

- **Updated scraper**: Replaced deprecated `github-trend` package with modern custom scraper
- **Modern dependencies**: Upgraded to latest versions of Express, Axios, Cheerio, and other packages
- **Improved reliability**: Added retry logic and multiple selector fallbacks for robust scraping
- **Better error handling**: Enhanced error logging and graceful failure recovery


## Pages
[Github Trends](https://www.facebook.com/github.trends/)  
[Github Trends C#](https://www.facebook.com/github.trends.c.sharp/)  
[Github Trends Javascript](https://www.facebook.com/github.trends.javascript/)  
[Github Trends Css](https://www.facebook.com/github.trends.css.bot/)  
[Github Trends Html](https://www.facebook.com/github.trends.html.bot/  )  
[Github Trends Java](https://www.facebook.com/github.trends.java.bot/  )  
[Github Trends Php](https://www.facebook.com/github.trends.p.hipertext.prepocessor/  )  
[Github Trends Python](https://www.facebook.com/github.trends.python/   )  
[Github Trends Swift](https://www.facebook.com/Github-Trends-Swift-371312076570996/  )  





# Project Details:  


## Flow
 We have 2 trigger:

`/api/githubTrigger` - scrapes trending github repo, saves new repos in mongodb and removes duplicates  

`/api/fbTrigger` - gets data from mongodb and posts it to the fb page   

[uptimeRobot](https://uptimerobot.com) - pings each urls in every 3 hours and renews information


## Setup and Deployment

### Prerequisites

1. **MongoDB** - Database to store trending repositories
2. **Facebook App** - Create an app at [Facebook Developers](https://developers.facebook.com/)
3. **Facebook Pages** - One or more pages where you want to post
4. **Page Access Tokens** - Long-lived tokens for each Facebook page

### Installation

```bash
npm install
```

### Configuration

#### Option 1: Environment Variables (Recommended for production)

Set the following environment variables:

```bash
# MongoDB Connection
export mongoDBConnection="mongodb://localhost:27017/fb-github-trends"

# Facebook Page Access Tokens
export allLangAccessToken="YOUR_GENERAL_PAGE_TOKEN"
export javascriptAccessToken="YOUR_JAVASCRIPT_PAGE_TOKEN"
export pythonAccessToken="YOUR_PYTHON_PAGE_TOKEN"
export csharpAccessToken="YOUR_CSHARP_PAGE_TOKEN"
export cssAccessToken="YOUR_CSS_PAGE_TOKEN"
export htmlAccessToken="YOUR_HTML_PAGE_TOKEN"
export javaAccessToken="YOUR_JAVA_PAGE_TOKEN"
export phpAccessToken="YOUR_PHP_PAGE_TOKEN"
export swiftAccessToken="YOUR_SWIFT_PAGE_TOKEN"
```

#### Option 2: Local Configuration File

Create `utils/secretGitIgnore.js`:

```javascript
module.exports = {
    mongoDBConnection: 'mongodb://localhost:27017/fb-github-trends',
    allLangAccessToken: 'YOUR_TOKEN',
    javascriptAccessToken: 'YOUR_TOKEN',
    pythonAccessToken: 'YOUR_TOKEN',
    // ... other tokens
};
```

### Getting Facebook Access Tokens

1. Create a Facebook App at [developers.facebook.com](https://developers.facebook.com/)
2. Add your Facebook pages to the app
3. Generate page access tokens
4. Use the `/api/fbTrigger/extendAccessToken/:appId/:appSecret/:token` endpoint to get long-lived tokens (60 days)

### Running the Application

```bash
# Start the server
node server.js

# Server runs on port 3000 (or PORT environment variable)
```

### API Endpoints

#### `/api/githubTrigger`
Scrapes GitHub trending repositories and saves them to MongoDB

```bash
curl http://localhost:3000/api/githubTrigger
```

#### `/api/fbTrigger`
Posts unposted repositories to Facebook pages (posts one repo every 60 seconds)

```bash
curl http://localhost:3000/api/fbTrigger
```

#### `/api/fbTrigger/log`
View repositories that haven't been posted yet

```bash
curl http://localhost:3000/api/fbTrigger/log
```

### Testing

```bash
# Test the GitHub scraper
node test-scraper.js

# Test Facebook post structure
node test-fb-posting.js
```

### Automated Posting with UptimeRobot

Set up monitoring at [uptimerobot.com](https://uptimerobot.com) to ping your endpoints:

- `/api/githubTrigger` - Every 3 hours (scrapes new trending repos)
- `/api/fbTrigger` - Every 3 hours (posts to Facebook)

## Links I have used extensively during development
[Automating posts on FB page](http://stackoverflow.com/questions/26605805/automatic-post-to-my-facebook-page-from-node-js-server)
[developers.facebook.com](https://developers.facebook.com/apps/813508885415765/settings/)
[Access token debug](https://developers.facebook.com/tools/debug/accesstoken)
[Deploy node.js app to heroku](https://scotch.io/tutorials/how-to-deploy-a-node-js-app-to-heroku)
[Heroku configuration variables](https://devcenter.heroku.com/articles/config-vars)


