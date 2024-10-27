#!/bin/sh
set -e

echo "Waiting for postgres..."
until nc -z postgres 5432; do
  sleep 1
done
echo "Postgres is up - executing migrations"

# Ensure migrations directory exists
MIGRATIONS_DIR="libs/backend/data-access/src/lib/prisma/migrations"
if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "Creating migrations directory..."
    mkdir -p "$MIGRATIONS_DIR"
fi

dotenv -e libs/backend/core/src/lib/config/env/development.env -- pnpm exec prisma migrate deploy --schema ./libs/backend/data-access/src/lib/prisma/schema.prisma
