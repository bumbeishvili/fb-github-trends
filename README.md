# fb-github-trends
Automatically post Github trends on Facebook page


## Pages
https://www.facebook.com/github.trends/  
https://www.facebook.com/Github-Trends-C-105343746644229/  
https://www.facebook.com/Github-Trends-Javascript-216692155458413/  
https://www.facebook.com/Github-Trends-Css-147815779051387/  
https://www.facebook.com/Github-Trends-Html-715045588671877/  
https://www.facebook.com/Guthub-Trends-Java-1150212921764093/  
https://www.facebook.com/Github-Trends-Php-272019956551887/  
https://www.facebook.com/Github-Trends-Python-398893913779593/  
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


