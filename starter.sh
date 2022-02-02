#!/bin/bash

a=/home/node/app
b=/home/node/app
c=/home/node/app

if [[ ! -d $a ]] || [[ ! -d $b ]] || [[ ! -d $c ]]; then
   echo "panic! path not found"
   exit 1
fi

cd $a
cd $b
cd $c
/bin/sh -ec 'npx sequelize-cli db:migrate' &
/bin/sh -ec  'yarn run prod' &
/bin/sh -ec  'yarn run prod-queue'