#!/usr/bin/env sh

cd /var/www

echo ""
echo "#################################################################################################################"
echo "Running NodeJS Backend Server: $(date +"%d.%m.%Y %r")"
echo ""

npm install

npm run typeorm migration:run

echo ""
echo "APP Started: $(date +"%d.%m.%Y %r")"
echo "#################################################################################################################"
echo ""

npm run start
