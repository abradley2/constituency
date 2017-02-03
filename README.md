# LeBroN Example

This is a kewl example of the Lebron stack built upon guidance from
[this article](https://github.com/yoshuawuyts/tiny-guide-to-non-fancy-node).

It is too fleshed out to be a boilerplate or a starter (making one of those is
a TODO).

## Setup

Create a local.js file at the root of this with the following:

```
module.exports = {
	serverSecret: 'PutYourSecretStringUsedToSignSecureCookiesHere'
}
```

`npm install -g nodemon` (for development server)  
`npm install` or `yarn install` (for local dependencies)  

## Commands

`npm run start-dev` (runs the app in development mode)  
`npm run start-prod` (runs the app in "production" mode)  

In development, open `localhost:9966`. In production, the app is hosted on `localhost:3000`
