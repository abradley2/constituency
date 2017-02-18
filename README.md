# Constituency

## Setup

Create a local.js file at the root of this project with the following:

```
module.exports = {
	proPublicaApiKey: 'Put-Your-ProPublica-Api-Key-Here',
	congressSession: 115,
	redisPort: 6379 // this key is optional. It will default to 6379
}
```

`npm install -g nodemon` (for development server)  
`npm install` or `yarn install` (for local dependencies)  

`redis-server` spin up a redis server

## Commands

`npm run start-dev` (runs the app in development mode)  
`npm run start-prod` (runs the app in "production" mode)  

In development, open `localhost:9966`. In production, the app is hosted on `localhost:3000`
