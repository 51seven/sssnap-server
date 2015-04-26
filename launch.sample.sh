#!/bin/sh

for i in "$@"
do
  IFS="=" read -a array <<< "${i}"
  key="${array[0]}"
  value="${array[1]}"

case $key in
  PORT)
  SETPORT="$value"
  shift
  ;;
  NODE_ENV)
  SETENVIRONMENT="$value"
  shift
  ;;
  *)
    # unknown option
  ;;
esac
shift
done

GOOGLE_CLIENT_ID=INSERT_YOUR_CLIENT_ID.apps.googleusercontent.com \
GOOGLE_CLIENT_SECRET=INSERT_YOUR_CLIENT_SECRET \
NODE_ENV=$SETENVIRONMENT \
PORT=$SETPORT \
node server.js;
