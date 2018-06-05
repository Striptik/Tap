# Tap
Mini Project with MEAN stack

# API-starter
Boilerplate for node API with good architecture and principals require package (Express, mongoose, passport, eslint-airbnb, helmet, cookie parser, babel) made with ES6 (still with CommonJS, waiting for node native support).


## How does it work ?
=> Install, Run, npm scripts ...

# TODO


## BASE CONFIGURATION

- [x] Add first packages (eslint, babelrc, gitignore)

- [x] Add config files

- [x] Configure Express

- [x] Create Architecture (components, routes, models ...)

- [x] Add dotenv

- [x] Create Module User


## DB

- [x] Configure mongoose

- [x] Add Forest


## Security / Test / Check / Midlleware

- [x] Add Morgan

- [x] Add Passport JWT

- [ ] Add Passport Facebook

- [x] Add cookie parser

- [x] Add CORS

- [x] Add Winston with Loggly

- [x] Add Helmet

- [ ] Add Ngnix reverse proxy

- [x] Rate limits

- [x] Reset System

- [x] JWT 

- [ ] Add Flow

- [ ] Create Test with Jest

- [ ] Package the app (pkg)

## Others

- [ ] Ajouter webpack ou parcel

- [ ] Make a clear documentation\

- [ ] Explain all modules / make a clean readme

Remind :

Each new module (schema) created verify authentification need.
ncu (update version packages)




# Prerequisites

You need to have mongoDB, redis-server, npm, installed and configured in your computer.

# Install

To use this project, at the very first begining,
Clone this repository (zip or git clone).


Next, you have to configure dotenv, with dotenv file (.env) at the root directory.


```
//.env
DOTENV FILE
```


Eventually, you can create a directory with a .env file for production, stagging, local, etc. But never commit it.

Then, you need to create few accounts to use the same components and the current config. 
You need a *(loggly account)*[https://www.loggly.com/], a *mongoDB* provider like (mongoDB cloud)[https://www.mongodb.com/] or (mLab)[https://mlab.com/], a *(forestAdmin account)*[https://app.forestadmin.com/].
Feel free to remove any dependencies you don't need.

 
You can complete all the needed env variables.


It's time to install dependecies 
`yarn | npm i`

# Start the API

Just run `yarn dev` or `npm run dev` for dev environnement


For Production environnement it will be `yarn start | npm run start`



# Configuration

dotenv

logger

Norme route api 
logger
description retour api (message, error, data)

rateLIMIT
redis

deploiement
 Heroku / now
>>>>>>> c04212a4f8d86dec126783ec347261ad8c266613
