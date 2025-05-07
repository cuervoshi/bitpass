#!/bin/sh

echo "⏳ Waiting for the database to be ready..."
until nc -z db 5432; do
  sleep 1
done

echo "✅ Database is up. Running migrations..."
npx prisma migrate deploy

echo "🚀 Starting the application..."
exec pnpm start