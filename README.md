# sssnap Server

The sssnap webserver

## Installation

```bash
npm install
```

## First steps

**IMPORTANT: You have to do this before you start the server the first time because you need to specify a Google OAuth2 Client ID and secret.** 

1. Copy the file `launch.sample.sh` and rename it to `launch.sh`.
2. Visit the [Google Developers Console](https://console.developers.google.com) and create a new project.
3. Go to *APIs & auth > Credentials* and Create a new Client ID. Make it a Web application.
4. In the first field *"Authorized JavaScript origins"* insert:  
`https://localhost:4000`
5. In the second field *"Authorized redirect URIs"* insert:  
`https://localhost:4000/auth/google/callback`
6. Click *Create Client ID*.
7. Insert the Client ID and Client secret in `launch.sh`.
8. Done.

## Starting the server

Be sure MongoDB is running. Then type:

```bash
npm start
```

You can start the server in different environments and/or with a different port.

```bash
npm start NODE_ENV=production PORT=3000
```

`NODE_ENV` defaults to `development`  
`PORT` defaults to `4000`

*Note: Currently only NODE_ENV and PORT are supported as cli-arguments.*

## Under the hood

When executing `npm start` the `launch.sh` bash file will be executed. This is necessary for storing and accessing Client IDs and secrets in a safe place. The bash script will set all environment variables and run the server.

Also, while the server starts, a script will check the availability of the environment variables. If they're not specified the server terminates itself.

## Help!

**I'm starting the server and get "error: MongoDB connection error" together with a huge gibberish ErrorStack.**  
*Answer: Dude, "Be sure MongoDB is running."*

**The page is loading an eternity and I don't get a response.**  
*Answer: Are you sure you're calling the server over https? http is not supported.*

**Why isn't http supported?**  
*Answer: In a production environment node will always be behind a proxy. The proxy will take care of redirecting http to https.*

**I get an error "Cannot start Server due to missing * credentials."**  
*Answer: You can't simply run server.js. Use npm start or the provided bash file, it really doesn't matter.*

**Everytime I start the server a directory named incoming is created in the project.**  
*Answer: That's fine. The uploaded and not-yet processed images will be stored there temporarily. This way your temp-filesystem won't be spammed and it's better for development/debugging purposes.*

**I'm using Windows and can't execute the bash script!**  
*Answer: Who are you?*
