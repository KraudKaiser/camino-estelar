#!/bin/sh

echo "Running database migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx tsx src/prisma/seed.ts

echo "Starting server..."
node dist/index.js
