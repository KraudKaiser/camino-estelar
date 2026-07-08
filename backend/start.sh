#!/bin/sh

echo "Pushing database schema..."
npx prisma db push --accept-data-loss

echo "Seeding database..."
npx tsx src/prisma/seed.ts

echo "Starting server..."
node dist/index.js
