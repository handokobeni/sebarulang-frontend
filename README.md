# Sebarulang Frontend

Frontend web application untuk platform Sebarulang menggunakan Next.js 16+ dengan TypeScript dan Feature-Based Structure.

## Tech Stack

- **Framework**: Next.js 16+ (App Router) dengan React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: 
  - TanStack Query (server state)
  - Zustand (global client state)
- **HTTP Client**: Axios dengan interceptors
- **Forms**: React Hook Form + Zod
- **Testing**: Jest + React Testing Library + Playwright + Cucumber
- **Monitoring**: Sentry (dengan quota optimization)

## Project Structure

```
frontend/
├── app/                    # Next.js App Router (Pages/Routing)
├── features/              # Feature modules (Business Logic)
├── shared/                # Shared code across features
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Shared hooks
│   └── utils/           # Utility functions
├── lib/                  # Core infrastructure
│   ├── api/             # API client
│   ├── auth/            # Auth infrastructure
│   ├── query/           # TanStack Query setup
│   └── monitoring/      # Sentry & logging
├── types/                # Global types
└── tests/                # Testing infrastructure
```

## Getting Started

### Prerequisites

- Node.js 18.17+ atau lebih baru
- pnpm 10+

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local dengan API URL yang sesuai
```

### Development

```bash
# Start development server
pnpm dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run unit tests
- `pnpm test:watch` - Run unit tests in watch mode
- `pnpm test:coverage` - Run tests with coverage
- `pnpm test:e2e` - Run E2E tests
- `pnpm test:e2e:ui` - Run E2E tests with UI
- `pnpm analyze` - Analyze bundle size

## Environment Variables

See `.env.example` for all available environment variables.

**Required**:
- `NEXT_PUBLIC_API_URL` - Backend API URL

**Optional**:
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN for error tracking
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key (Phase 2)

## Architecture

### Feature-Based Structure

Code diorganisir berdasarkan fitur, bukan technical layers. Setiap feature memiliki:

- `components/` - Feature-specific components
- `hooks/` - Feature-specific hooks (business logic)
- `api/` - Feature API calls (data access)
- `types.ts` - Feature domain types

### Dependency Flow

```
Pages (app/)
    ↓ depends on
Feature Components (features/[feature]/components/)
    ↓ depends on
Feature Hooks (features/[feature]/hooks/)
    ↓ depends on
Feature API (features/[feature]/api/)
    ↓ depends on
API Client (lib/api/)
    ↓ depends on
Backend API
```

## Code Style

- Follow `.cursorrules` untuk semua coding standards
- NO inline styles - gunakan Tailwind CSS classes
- TypeScript strict mode enabled
- ESLint + Prettier untuk code quality
- Follow SOLID principles

## Testing

### TDD (Test-Driven Development)

Unit tests untuk components dan hooks menggunakan Jest + React Testing Library.

### BDD (Behavior-Driven Development)

E2E tests menggunakan Playwright + Cucumber dengan Gherkin feature files.

**Important**: Write Gherkin feature files BEFORE implementation!

## Security

- httpOnly cookies untuk token storage (handled by backend)
- Input validation dengan Zod
- XSS prevention (React auto-escapes)
- Security headers configured
- CSP dengan nonce (implemented in proxy.ts)

## Monitoring

Sentry configured dengan quota optimization:
- 10% transaction sampling
- Filter non-critical errors
- Remove sensitive data
- 50 breadcrumbs max (reduced from 100)

## License

Private - Sebarulang Project
