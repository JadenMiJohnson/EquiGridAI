# EquiGrid AI - Energy Optimization Platform

## Overview

EquiGrid AI is a full-stack web application that helps data center operators and cloud companies optimize their energy operations for cost savings, carbon reduction, and community impact. The platform provides AI-powered recommendations, real-time energy zone analytics, and comprehensive reporting capabilities.

The application serves two primary user personas:
- **Data Center Operators**: Own and manage physical data center facilities
- **Cloud Companies**: Run workloads on cloud infrastructure

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight React Router alternative)
- TanStack Query (React Query) for server state management and data fetching
- Tailwind CSS for styling with shadcn/ui component library (Radix UI primitives)
- Recharts for data visualization and charts

**Design System:**
- Material Design + Linear inspired aesthetic with sustainability tech focus
- Dark mode as default with light mode support
- Typography: Inter for UI/body text, JetBrains Mono for numeric displays
- Custom color system with HSL-based theming for easy dark/light mode switching
- Mobile-first responsive design approach

**State Management:**
- React Context for global state (auth, theme)
- Local storage for persistence (session, theme preference)
- TanStack Query handles all server state with automatic caching and refetching
- Form state managed locally with React Hook Form and Zod validation

**Key Architectural Decisions:**
- **Monorepo structure**: Client and server in same repository with shared TypeScript types
- **Type safety**: Shared schema definitions using Zod for runtime validation and TypeScript type generation
- **Component composition**: Heavily uses Radix UI headless components for accessibility and customization
- **Path aliases**: TypeScript path mapping (`@/`, `@shared/`) for clean imports

### Backend Architecture

**Technology Stack:**
- Node.js with Express.js
- TypeScript throughout
- In-memory storage (MemStorage class implementing IStorage interface)
- Session-based authentication (stored in localStorage on client)

**API Design:**
- RESTful HTTP endpoints under `/api/*` prefix
- JSON request/response format
- Zod schema validation for all API inputs
- Graceful error handling with descriptive error messages

**Data Layer:**
- **Current**: In-memory storage using TypeScript classes
- **Future-ready**: Storage abstracted behind IStorage interface for easy migration to PostgreSQL with Drizzle ORM
- Mock data generators for demo/development mode

**Key Architectural Decisions:**
- **Storage abstraction**: IStorage interface allows swapping in-memory storage for database without changing business logic
- **Mode switching**: LIVE vs MOCK modes for data sources (external APIs vs demo data)
- **Shared types**: Single source of truth for types between client and server via `shared/schema.ts`
- **Middleware logging**: Custom request/response logging for API routes with timing

### Authentication & Authorization

**Authentication Strategy:**
- Simplified session-based auth stored in localStorage
- Quick login options for both personas (operator/cloud)
- Email/password login support (demo implementation)
- Session object contains: userId, role, companyName, email

**Authorization:**
- Role-based access control (RBAC) with two roles: "operator" and "cloud"
- Protected routes use ProtectedRoute component wrapper
- Persona switching allows users to toggle between operator and cloud views
- No backend session validation (client-side trust model for demo purposes)

### External Dependencies

**Third-Party UI Libraries:**
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives (@radix-ui/react-*)
- **shadcn/ui**: Pre-styled components built on Radix UI with Tailwind CSS
- **Recharts**: Declarative charts built on React and D3
- **MapLibre GL**: Open-source mapping library for zone visualization (token-free)

**API Integrations (Planned/Mock):**
- **EIA Open Data API**: Energy Information Administration data for grid metrics
- **EPA AirNow API**: Air quality index data
- **EPA CAMD API**: Carbon emissions data
- **US Census ACS**: Demographic and socioeconomic data
- **Open-Meteo**: Weather data

**AI Integration:**
- **OpenAI GPT-5**: AI-powered energy recommendations via Replit AI Integrations
- Graceful fallback to rule-based recommendations when AI unavailable
- Configurable via environment variables (AI_INTEGRATIONS_OPENAI_BASE_URL, AI_INTEGRATIONS_OPENAI_API_KEY)

**Utilities & Tooling:**
- **Drizzle ORM & Drizzle Kit**: TypeScript-first ORM configured for PostgreSQL (schema defined but not yet connected)
- **Zod**: Runtime type validation and schema definition
- **date-fns**: Date manipulation and formatting
- **class-variance-authority (cva)**: Type-safe component variants
- **clsx & tailwind-merge**: Conditional className composition

**Build & Development:**
- **Vite**: Fast HMR and optimized production builds
- **esbuild**: Server bundling for production
- **TSX**: TypeScript execution for development server
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

**Database (Configured but Not Active):**
- **PostgreSQL**: Target database (via @neondatabase/serverless)
- **Drizzle ORM**: Schema defined in `shared/schema.ts`, migrations configured
- **Connection**: DATABASE_URL environment variable required to activate
- Current implementation uses in-memory storage as placeholder