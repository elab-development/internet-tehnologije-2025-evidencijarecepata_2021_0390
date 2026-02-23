#!/bin/bash
set -e

echo "Waiting for MySQL..."
until php -r "new PDO('mysql:host='.getenv('DB_HOST').';port='.getenv('DB_PORT'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'));" 2>/dev/null; do                                                                    
    sleep 2
done

echo "MySQL is ready."

php artisan config:clear
php artisan migrate --force

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf