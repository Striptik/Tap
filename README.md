# Tap
Mini Project with MEAN stack (Angular 6, Node, Express, Mongo, JWT, Passport, BCrypt, Rate limiter...)

![Tap Game](https://image.ibb.co/fQ2H08/Capture_d_e_cran_2018_06_10_a_16_06_04.png)


## Prerequisites

You need to have install and functionnal in your computer :

 [x] - Node (at least v8.9)
 [x] - MongoDB installed
 [x] - Redis Server Installed (https://redis.io/topics/quickstart)
 [x] - A _.env_ file at root project, where there's all the environnement variables needed

## Install

This Project has two main parts : The API & the Client
To make it works, you need to install both of them.

You can launch the npm script which is going to install the twice :

```
npm run setup | yarn setup
```

or you can install them seperately in the _root directory_ and the _client/ directory_ running : 
```
npm install | yarn
```


## Start

First, you need to have the .env file at root project

Then, mongoDb and redis-server needed to be launch (`sudo mongod` and `redis-server`)

_If you really have troubles to launch redis-server, you can disable the limiter (DISABLE_LIMITER='YES') in the .env but you will be exposed to risks of bot or script hit on your api_


To laucnch the Client and API at the same time run : 
```
  npm run start | yarn start
```

If you want to launch both independently, you can run the api with
```
API: 
npm run start-api

ANGULAR:
npm run start-client

```


Finally, you can play at the Tap game on **http://localhost:4200**
and the API is available through **http://localhost:4444**



--------





## Security

The security between the API and the Client is made with **JWT token**,
with **passport** module to access at the private routes of the API.

There's a second middleware on the routes, a **rate limiter**, to protect the Api of a big amount of requests (**express-limiter**), which work with redis-server. You can disable it on the .env file but it's not a good idea.

All the secrets or privates variables are injected using **dotenv**, to avoid writing conf file and use it directly on the code or hard coded needed variables (api key, presets, ...). _I commit it to make the example easier to launch, if you want to reuse the project, add .env to your .gitignore and exec `git rm --cached .env` to remove it from the files_ 

There's a logger included (loggly), with a specific format which render informations and errors explicit. You can configure in the .env file. and enable online logs sending. Actually, there's only log on the **terminal** and a **error.log file** with the errors. **Morgan** is configured with loggly to send http logs.


## Reusability


The format to add routes on the Api is a kind of standar, separate by module, with controller, model and routes. You can find Services on the folder _Services_.
The code is  as cleanest as possible, with **eslint (airbnb config)**, javascript good practises (es6/7/8, avoid callback to use promises, ...)


Angular is setup at the last version (6), i think there's work to make it proper as the API (partials, more reactive programming with rx ...), but it's a good begining with modular services, and separetes concerns.


