# Turnos Medicos - Service E-Commerce

A small-scale service-based e-commerce platform for radiology/diagnostic imaging services. Customers browse services, purchase appointments, and coordinate scheduling via WhatsApp.

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, Prisma
- **Database:** PostgreSQL 15
- **Deployment:** Docker, AWS EC2 (Free Tier)

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm or yarn

### Development

1. Clone the repository
2. Copy `.env.example` to `.env` and configure
3. Start with Docker Compose:

```bash
docker-compose up -d
```

4. Run database migrations:

```bash
docker-compose exec backend npx prisma migrate dev
```

5. Seed the database:

```bash
docker-compose exec backend npx ts-node src/prisma/seed.ts
```

6. Access:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000/api/health
   - Admin Panel: http://localhost:3000/admin

### Default Admin Credentials

- Email: admin@example.com
- Password: admin123

## Project Structure

```
turnos-medicos/
├── frontend/           # Next.js app
├── backend/            # Express API
├── nginx/              # Nginx config
├── docker-compose.yml
└── .env.example
```

## Features

- Public service catalog
- Service detail pages with pricing
- MercadoPago payment integration
- Bank transfer with proof upload
- Discount coupon system
- WhatsApp redirection
- Admin panel for management
