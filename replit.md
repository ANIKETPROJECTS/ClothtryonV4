# ONYU Virtual Try-On Platform

## Overview

ONYU is a premium virtual try-on web application for luxury t-shirts. The platform combines e-commerce functionality with real-time AI-powered pose detection to let customers virtually "try on" clothing using their device camera. The application uses TensorFlow.js with MoveNet for body tracking and overlays product images based on detected body orientation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for page transitions and interactions
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints defined in shared/routes.ts
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Build Process**: Custom esbuild script bundles server with selective dependency bundling

### Virtual Try-On Feature
- **Pose Detection**: TensorFlow.js with MoveNet (SINGLEPOSE_LIGHTNING model)
- **Camera Access**: react-webcam for video feed
- **Rendering**: Canvas overlay for t-shirt positioning
- **View Detection**: Automatic switching between front/back/left/right views based on body orientation

### Data Storage
- **Database**: PostgreSQL (provisioned via Replit)
- **Schema Location**: shared/schema.ts
- **Migrations**: Drizzle Kit with migrations output to /migrations folder
- **Product Schema**: Products table with JSONB for multi-view images (front, back, left, right)

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/   # UI and feature components
│       ├── pages/        # Route pages (Home, Shop, ProductDetail, About)
│       ├── hooks/        # Custom React hooks
│       └── lib/          # Utilities and configuration
├── server/           # Express backend
│   ├── routes.ts     # API endpoint definitions
│   ├── storage.ts    # Database access layer
│   └── db.ts         # Database connection
├── shared/           # Shared types and schemas
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API route definitions with Zod validation
└── migrations/       # Database migrations
```

### Key Design Decisions
- **Monorepo Structure**: Client, server, and shared code in single repository for type safety across boundaries
- **Shared Route Definitions**: API routes defined once with Zod schemas, used by both client and server
- **Type-Safe Database**: Drizzle ORM provides TypeScript types inferred from schema
- **Luxury Aesthetic**: Dark theme with gold accents, premium fonts (Sora, Inter)

## External Dependencies

### Database
- **PostgreSQL**: Primary database via DATABASE_URL environment variable
- **Drizzle ORM**: Type-safe database queries and migrations

### AI/ML Services
- **TensorFlow.js**: Client-side machine learning runtime
- **MoveNet Model**: Pre-trained pose detection model loaded in browser

### UI Framework Dependencies
- **Radix UI**: Accessible component primitives (dialog, popover, tabs, etc.)
- **shadcn/ui**: Pre-styled component library built on Radix
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Development server with HMR
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner (dev only)

### Runtime Environment
- Requires webcam/camera permissions for virtual try-on feature
- WebGL backend required for TensorFlow.js pose detection