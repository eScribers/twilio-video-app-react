# Running natively

## Prerequisites
- node

## How to run
1. Copy `/public/config_json_example/config.json` > `/public/config.json` and set `domainName: 'localhost:3000'` and `endPoint: 'localhost:3001'` (if running endPoint locally)
1. Run `npm i`
1. Run `npm start`
1. Go to http://localhost:3000
1. Enjoy!


# Running using docker (slow performance)

## Prerequisites
- docker

## How to run
1. Copy `/public/config_json_example/config.json` > `/public/config.json` and set `domainName: 'localhost:3000` and `endPoint: 'localhost:3001'` (if running endPoint locally)
1. Run `docker-compose -f "docker-compose.yml" up -d --build` (and wait for a few minutes to install dependencies and start)
1. Go to http://localhost:3000
1. Enjoy!
