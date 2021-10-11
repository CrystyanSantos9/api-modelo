#!/bin/bash

a=/home/node/app
b=/home/node/app

if [[ ! -d $a ]] || [[ ! -d $b ]]; then
   echo "panic! path not found"
   exit 1
fi

cd $a
cd $b
/bin/sh -ec 'yarn run prod' &
/bin/sh -ec  'yarn run prod-queue'