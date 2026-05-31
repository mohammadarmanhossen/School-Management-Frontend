# School Management System - Frontend

Enterprise-grade School Management System frontend built with Next.js 15 App Router, TypeScript, Tailwind CSS, and ShadCN UI.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS** + ShadCN UI
- **TanStack Query** + Axios
- **Zustand** (state management)
- **React Hook Form** + Zod
- **Recharts** (analytics)
- **Framer Motion**
- **Next Themes** (dark mode)
- **Sonner** (toast notifications)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@school.edu.bd    | admin123    |
| Teacher | teacher@school.edu.bd  | teacher123  |
| Student | student@school.edu.bd  | student123  |
| Parent  | parent@school.edu.bd   | parent123   |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Authentication pages
│   ├── dashboard/          # Admin/Teacher/Student dashboard
│   └── parent/             # Parent portal
├── components/
│   ├── ui/                 # ShadCN UI components
│   └── shared/             # Reusable components
├── features/               # Feature-specific components
├── hooks/                  # Custom React hooks
├── layouts/                # Layout components
├── lib/                    # Utilities & mock data
├── providers/              # Context providers
├── schemas/                # Zod validation schemas
├── services/               # API services & Axios client
├── store/                  # Zustand stores
├── types/                  # TypeScript types
├── utils/                  # Helper utilities
├── constants/              # App constants
└── middleware.ts           # Auth middleware
```

## Features

- JWT Authentication with refresh token
- Role-based access control (RBAC)
- Analytics dashboard with charts
- Student/Teacher/Class management
- Attendance tracking (QR ready)
- Exam & Result management (BD grading)
- Fee management (bKash, Nagad, Rocket, SSLCommerz)
- Assignment, Library, Transport modules
- Dark/Light mode
- PWA support
- Responsive mobile-friendly design

## API Integration

Set `NEXT_PUBLIC_API_URL` in `.env.local` to connect to your Django REST backend.

## Deployment

Deploy to Vercel:

```bash
npm run build
```

## License

MIT
