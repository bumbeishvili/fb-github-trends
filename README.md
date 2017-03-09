# fb-github-trends
Automatically post Github trends on Facebook page


## Pages
https://www.facebook.com/github.trends/  
https://www.facebook.com/github.trends.c.sharp/  
https://www.facebook.com/github.trends.javascript/  
https://www.facebook.com/github.trends.css.bot/  
https://www.facebook.com/github.trends.html.bot/  
https://www.facebook.com/github.trends.java.bot/  
https://www.facebook.com/github.trends.p.hipertext.prepocessor/  
https://www.facebook.com/github.trends.python/ 
https://www.facebook.com/Github-Trends-Swift-371312076570996/  


## Flow
 2 triggers  exists

`/api/githubTrigger` - scrapes trending github repo, saves new repos in mongodb and removes duplicates  

`/api/fbTrigger` - gets data from mongodb and in every 20 second, posts it to the fb page   

https://uptimerobot.com - pings each urls in every 3 hours and renews information


## Links I have used extensively during development
http://stackoverflow.com/questions/26605805/automatic-post-to-my-facebook-page-from-node-js-server  
https://developers.facebook.com/apps/813508885415765/settings/
https://developers.facebook.com/tools/debug/accesstoken  
https://scotch.io/tutorials/how-to-deploy-a-node-js-app-to-heroku  
https://devcenter.heroku.com/articles/config-vars


