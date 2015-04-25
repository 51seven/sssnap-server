#!/bin/sh

GOOGLE_CLIENT_ID=INSERT_YOUR_CLIENT_ID.apps.googleusercontent.com \
GOOGLE_CLIENT_KEY=INSERT_YOUR_CLIENT_SECRET \
NODE_ENV=$1 \
node server.js;
