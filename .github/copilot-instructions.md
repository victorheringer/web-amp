# AI Coding Agent Instructions - Web-Amp

## Project Overview
A music/video streaming web application built with Vite + React + TypeScript, using shadcn/ui components and Tailwind CSS. The app features a YouTube-like interface with playlists, video cards, and a persistent bottom player. Originally created with [Lovable](https://lovable.dev), this is a frontend-only application with mock data (no backend yet).

## Tech Stack & Architecture

### Core Technologies
- **Build Tool**: Vite 5.4 with SWC for fast React compilation
- **Framework**: React 18.3 + TypeScript 5.8
- **Routing**: React Router v6 (BrowserRouter)
- **State Management**: @tanstack/react-query for async state; local useState for UI state
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: shadcn/ui (Radix UI primitives + Tailwind variants)
- **Icons**: lucide-react
- **Forms**: react-hook-form + zod validation
- **Toast Notifications**: sonner + custom toast system

### Key Architectural Patterns

**1. Import Aliases** - Always use `@/` for src imports:
```tsx
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
```

**2. Routing Structure** - All custom routes MUST go ABOVE the catch-all route in `App.tsx`:
```tsx
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/playlist/:id" element={<Playlist />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

**3. Component Organization**:
- `src/components/` - Feature components (Player, Sidebar, VideoCard, etc.)
- `src/components/ui/` - shadcn/ui primitives (button, card, dialog, etc.)
- `src/pages/` - Route-level page components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utilities (currently just `utils.ts` with `cn()` helper)

**4. Design System & Theming**:
- All colors MUST be defined as HSL CSS variables in `src/index.css`
- Custom theme colors: `--primary`, `--sidebar-*`, `--player-background`, `--gradient-primary`, etc.
- Use `bg-gradient-primary bg-clip-text text-transparent` for gradient text effects
- Dark mode is the default theme (light mode not implemented)

**5. Data Persistence** - Uses localStorage for all data storage:
- Mock data arrays in components are temporary scaffolding
- Migrate to localStorage hooks for playlists, favorites, and user preferences
- No backend API - all state persists client-side
- Consider custom hooks like `useLocalStorage()` for consistent data access

**6. Video Provider Architecture** - Multi-provider support (YouTube is first):
```tsx
// Video data includes provider info
const video = {
  id: "1",
  videoId: "fJ9rUzIMcZQ",  // Provider-specific ID
  provider: "youtube",      // youtube, vimeo, dailymotion, etc.
  // ...
};
```
- Use YouTube embedded player initially (`iframe` with `youtube.com/embed/${videoId}`)
- Design components to be provider-agnostic for future expansion
- VideoModal should handle different embed URLs based on provider

## Development Workflows

### Running the Project
```bash
npm run dev          # Start dev server on http://[::]:8080
npm run build        # Production build
npm run build:dev    # Development build (with component tagger)
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Adding shadcn/ui Components
The project uses shadcn/ui CLI configuration (see `components.json`). To add new UI components:
```bash
npx shadcn@latest add [component-name]
```
Components are added to `src/components/ui/` with Tailwind styling.

### Adding New Pages
1. Create page component in `src/pages/PageName.tsx`
2. Add route in `App.tsx` ABOVE the `*` catch-all route
3. Use `Link` or `useNavigate` from react-router-dom for navigation

## Project-Specific Conventions

### Component Patterns
- **Functional Components**: Always use arrow function syntax with TypeScript
- **Props Typing**: Define interfaces inline above component or separately for reuse
- **State Management**: 
  - `useState` for ephemeral UI state (modals, selections)
  - localStorage for persistent data (playlists, favorites, settings)
  - React Query for caching and optimistic updates
- **Event Handlers**: Prefix with `handle` (e.g., `handleCreatePlaylist`)
- **Data Persistence**: Create custom hooks for localStorage operations (e.g., `useLocalStoragePlaylists()`)

### Styling Conventions
- Use Tailwind utility classes; avoid inline styles
- Responsive design: mobile-first with breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
- Hover states: `group` pattern for card hover effects (see `VideoCard.tsx`)
- Animations: Use `transition-*` utilities and CSS custom properties for smooth transitions
- Glass morphism: `backdrop-blur-lg` for player and modal backgrounds

### Code Style
- **ESLint**: Unused vars are allowed (`@typescript-eslint/no-unused-vars: off`)
- **TypeScript**: Lenient config - `noImplicitAny: false`, `strictNullChecks: false`
- **Imports**: Organize by external deps → internal deps → relative imports
- **Component Structure**: imports → interfaces → component → export

### Portuguese UI Text
Most user-facing strings are in Portuguese (e.g., "Bem-vindo de volta", "Minhas Favoritas"). Follow this pattern for new features unless told otherwise.

## Key Files to Reference

- `src/App.tsx` - Router setup, global providers (Query Client, Tooltip, Toaster)
- `src/index.css` - Complete design system with CSS variables
- `src/lib/utils.ts` - `cn()` utility for merging Tailwind classes
- `src/components/Player.tsx` - Fixed bottom player UI pattern
- `src/components/VideoCard.tsx` - Card hover effects and group pattern
- `tailwind.config.ts` - Extended theme with custom colors from CSS variables
- `vite.config.ts` - Path aliases (`@` → `./src`), SWC plugin, lovable-tagger for dev mode

## Current Limitations & Future Directions
- **No Backend**: All data persists in localStorage only (no server/API)
- **No Authentication**: User management not implemented
- **Video Providers**: YouTube embedded videos first; designed for multi-provider support (Vimeo, Dailymotion, etc.)
- **State Management**: localStorage + React Query for caching; may add Zustand for complex global state
- **No Testing**: Testing not planned for this project

## Development Tips
- The project uses `lovable-tagger` plugin in dev mode for component identification
- Server runs on IPv6 (`::`) on port 8080
- CSS variables approach makes theming flexible - extend in `index.css` for new design tokens
- shadcn/ui components are customizable - edit generated files in `src/components/ui/`
