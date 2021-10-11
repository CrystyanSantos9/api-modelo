#!/bin/bash

echo "source: https://unix.stackexchange.com/questions/454880/open-multiple-terminal-but-without-closing-the-previous-one-using-shell-script"
a=/home/vagrant/github/dev_samurai_apinode/api-modelo
b=/home/vagrant/github/dev_samurai_apinode/api-modelo

if [[ ! -d $a ]] || [[ ! -d $b ]]; then
   echo "panic! path not found"
   exit 1
fi

cd $a
cd $b
/bin/sh -ec 'yarn run dev' &
/bin/sh -ec  'yarn run queue'