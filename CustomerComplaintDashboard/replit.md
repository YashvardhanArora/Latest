# Complaint Management System

## Overview

This is a full-stack complaint management dashboard built with React, Express, and PostgreSQL. The application provides a comprehensive system for tracking and managing customer complaints with features like Kanban boards, analytics, and real-time updates.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management

## Key Components

### Frontend Architecture
- **Client Directory**: Contains all React frontend code
- **Component Structure**: Uses shadcn/ui for consistent UI components
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for API data fetching and caching
- **Styling**: Tailwind CSS with custom design system variables
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Server Directory**: Express.js server with TypeScript
- **API Routes**: RESTful API endpoints for complaint management
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Storage Interface**: Abstract storage interface for data operations

### Database Schema
The system uses three main tables:
- **Users**: User authentication and management
- **Complaints**: Core complaint data with status tracking
- **Complaint History**: Audit trail for complaint changes

### Key Features
- **Kanban Board**: Drag-and-drop interface for complaint status management
- **Dashboard Analytics**: Charts and statistics for complaint trends
- **Real-time Updates**: Automatic data refreshing every 30 seconds
- **Search and Filtering**: Advanced complaint filtering capabilities
- **Export Functionality**: Data export capabilities
- **Responsive Design**: Mobile-friendly interface

## Data Flow

1. **User Interaction**: Users interact with React components
2. **API Calls**: TanStack Query manages API requests to Express backend
3. **Server Processing**: Express routes handle business logic
4. **Database Operations**: Drizzle ORM executes PostgreSQL queries
5. **Response Flow**: Data flows back through the same chain
6. **UI Updates**: React components re-render with new data

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack Query
- **Forms**: React Hook Form with Hookform Resolvers
- **Validation**: Zod with Drizzle-Zod integration
- **Charts**: Recharts for data visualization
- **Styling**: Tailwind CSS, Class Variance Authority, clsx
- **Date Handling**: date-fns
- **Carousel**: Embla Carousel React

### Backend Dependencies
- **Server Framework**: Express.js
- **Database**: Drizzle ORM with Neon Database serverless driver
- **Session Management**: connect-pg-simple for PostgreSQL sessions
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build Tool**: Vite with React plugin
- **TypeScript**: Full TypeScript support across the stack
- **Database Migrations**: Drizzle Kit for schema management
- **Linting/Formatting**: PostCSS with Autoprefixer

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

- **Development**: `npm run dev` starts both frontend and backend in development mode
- **Production Build**: `npm run build` creates optimized builds for both client and server
- **Production Start**: `npm run start` runs the production server
- **Database**: PostgreSQL integration with environment variable configuration
- **Static Serving**: Express serves built React assets in production
- **Port Configuration**: Configured for port 5000 with external port 80

### Environment Setup
- **Node.js 20**: Modern JavaScript runtime
- **PostgreSQL 16**: Database with Drizzle migrations
- **Nix Package Management**: Stable channel for consistent builds

### Build Process
1. Frontend builds to `dist/public` using Vite
2. Backend builds to `dist` using esbuild
3. Production server serves static files and API routes
4. Database migrations run via `npm run db:push`

## Changelog
```
Changelog:
- June 27, 2025. Initial setup with React/Express complaint management system
- June 27, 2025. Fixed API routing issues for stats and trends endpoints  
- June 27, 2025. Added sample complaint data (6 complaints across different statuses)
- June 27, 2025. Created complete navigation with All Complaints, Analytics, Reports, Settings pages
- June 27, 2025. Fixed navigation warnings and implemented global sidebar layout
- June 27, 2025. Integrated BN logo and updated branding (removed "Management" from titles)
- June 27, 2025. Added Excel export functionality and collapsible sidebar with toggle button
- June 27, 2025. Removed "New Complaint" buttons to make dashboard visualization-only (no input functionality)
- June 27, 2025. Simplified Settings page to only include essential features: profile data management, password change, and 2-factor authentication
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```