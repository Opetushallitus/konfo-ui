#!/usr/bin/env sh

if [ -z $1 ]; then
  PORT=$npm_package_config_testport
else
  PORT=$1
fi;

if [ -z $2 ]; then
  BACKEND_PORT=$npm_package_config_testbackendport
else
  BACKEND_PORT=$2
fi;

echo 'Port is ' $PORT
echo 'Port for backend is ' $BACKEND_PORT

PORT=$PORT REACT_APP_BACKEND_PORT=$BACKEND_PORT npm run start-and-test