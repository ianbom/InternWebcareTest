#!/usr/bin/env sh
set -eu

wait-for-services

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    php artisan migrate --force
fi

mkdir -p storage/app/public
php artisan storage:link --force

if [ "${CACHE_CONFIG:-false}" = "true" ]; then
    php artisan optimize:clear
    php artisan config:cache
    if [ "${CACHE_ROUTES:-false}" = "true" ]; then
        php artisan route:cache
    fi
    php artisan view:cache
fi

exec "$@"
