# Тренажер маркетолога "Твой первый клиент"

## Overview
This project is an interactive training simulator designed to teach marketers how to launch targeted advertising campaigns. It uses a real-world case study of a flower shop, "ФлорАнна," to provide practical experience. The simulator guides users through various stages, from initial client interaction and creative development to ad launch, performance monitoring, and reporting, aiming to equip future marketers with essential skills.

## User Preferences
- **Communication Style:** I prefer clear and concise explanations.
- **Workflow:** I want iterative development with immediate feedback on changes.
- **Interaction:** Ask before making major architectural changes or introducing new dependencies.
- **Codebase Changes:** Do not alter the core logic for calculating ad campaign metrics; these should remain consistent as per the simulation's design.

## System Architecture

### Frontend
- **Framework:** React with TypeScript and Vite.
- **UI Components:** Utilizes Shadcn/UI and Tailwind CSS for a responsive and modern interface.
- **Key Components:**
    - `ChatInterface.tsx`: Manages client-user interactions, supporting text, images, and audio messages.
    - `AdCabinet.tsx`: Displays advertising campaign settings and real-time statistics.
    - `CookieBanner.tsx`: Cookie consent banner with localStorage persistence, shown on all pages.
- **State Management:** TanStack Query for data fetching and caching.
- **Messaging Types:** Supports various message types including `user`, `bot`, `bot-image`, `bot-audio`, `user-image`, `system`, and `system-alert`.
- **Mobile Adaptation:** Fully responsive design ensures usability across all devices.
- **Freemium UX:** "Start for free" and "Try demo" buttons lead directly to the trainer without registration. Paywall modal appears only for paid sections.
- **SEO:** Includes OG image, updated meta tags, favicon, and clickable logos.
- **Legal Compliance:** 
    - Required legal disclaimers, privacy policy links, and data processing consent checkboxes
    - INN 645318153031 displayed on Oferta page and trainer footer
    - Non-clickable email on Oferta page (trafik-im@yandex.ru)
    - Mandatory unchecked privacy consent checkbox in registration form
    - Cookie consent banner (fixed bottom, localStorage persistence, link to privacy policy)

### Backend
- **Framework:** Express.js.
- **Database:** Timeweb PostgreSQL, managed with Drizzle ORM for migrations.
- **Authentication:** Secure JWT authorization with mandatory `JWT_SECRET` validation, supporting `admin`, `premium_user`, and `user` roles. `bcrypt` is used for password hashing.
- **API Endpoints:**
    - `/api/auth/*`: Handles user registration, login, and token validation.
    - `/api/payment/*`: Ready for payment gateway integration (e.g., YooKassa).
- **Security:** JWT tokens and middleware protect routes.

### Design and Styling
- **Color Scheme:** Primary accent color is `#C5F82A` (lime green) against dark backgrounds (`#0B0C10`, `#0F1116`, `#16181D`).
- **Templates:** Landing page (`Landing.tsx`) and legal offer page (`Oferta.tsx`) are exact copies of original designs, including specific texts, layouts, and components (e.g., `WhyCard`, `ResultItem`, `PricingItem`, `FAQItem`).

### Development Workflow
- **Development Server:** `npm run dev` concurrently runs Vite (frontend on port 5000) and Express (backend on port 3001).
- **Database Synchronization:** `npm run db:push --force` for schema updates.
- **Assets:** Media files (images, audio) are stored in `attached_assets/` and imported via `@assets` alias.
- **Production Deployment:** `server/index.ts` serves static files from `dist/` on port 5000, with SPA fallback.

## External Dependencies
- **Database:** Timeweb PostgreSQL (host, port, user, password, database name, schema configured via environment variables).
- **Payment Gateway:** YooKassa (planned integration, API routes are prepared).
- **Analytics:** Yandex Metrika (ID 105483627) integrated with webvisor, clickmap, and e-commerce tracking.
- **UI Library:** Shadcn/UI.
- **CSS Framework:** Tailwind CSS.
- **Image Hosting:** All images for the simulator (e.g., `roses.png`, `tulips.png`, `box-composition.png`) are stored locally within `attached_assets/`.