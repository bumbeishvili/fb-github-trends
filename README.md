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


## Links I have used extensively during development
[Automating posts on FB page](http://stackoverflow.com/questions/26605805/automatic-post-to-my-facebook-page-from-node-js-server  )  
[developers.facebook.com](https://developers.facebook.com/apps/813508885415765/settings/)  
[Acces token debug](https://developers.facebook.com/tools/debug/accesstoken  )  
[Deploy node.js app to heroku](https://scotch.io/tutorials/how-to-deploy-a-node-js-app-to-heroku  )  
[Heroku configuration variables](https://devcenter.heroku.com/articles/config-vars)  


