#!/usr/bin/env sh
set -eu

if [ -n "${DB_HOST:-}" ]; then
    until php -r '$h=getenv("DB_HOST"); $p=(int) getenv("DB_PORT") ?: 3306; $s=@fsockopen($h, $p, $e, $m, 2); if (!$s) exit(1); fclose($s);' ; do
        sleep 2
    done
fi

if [ -n "${REDIS_HOST:-}" ]; then
    until php -r '$h=getenv("REDIS_HOST"); $p=(int) getenv("REDIS_PORT") ?: 6379; $s=@fsockopen($h, $p, $e, $m, 2); if (!$s) exit(1); fclose($s);' ; do
        sleep 2
    done
fi
