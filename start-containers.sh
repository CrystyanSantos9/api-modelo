#!/bin/sh
docker run --name mysql-container -p 3336:3306 --rm -v dados-do-banco:/var/lib/mysql --network rede-api-modelo -d --rm csantos/bd-mysql
sleep 2
docker run --name redis-container -v dados-da-fila-redis:/data --network rede-api-modelo -d --rm redis
sleep 2
docker run --name app-node-container -p 3000:3000 --network rede-api-modelo  -d --rm img-node-api-modelo
sleep 2
docker inspect $(docker ps -q) | grep IPAddress