# Тренажер маркетолога "Твой первый клиент"

## Overview
This project is an interactive training simulator designed to teach marketers how to launch targeted advertising campaigns. It uses a real-world case study of a flower shop, "ФлорАнна," to provide practical experience. The simulator guides users through various stages, from initial client interaction and creative development to ad launch, performance monitoring, and reporting, aiming to equip future marketers with essential skills.

## Recent Changes
- **25.11.2025:** Admin user deletion functionality added:
  - New `DELETE /api/users/:userId` endpoint with security safeguards
  - **SECURITY:** Only admin-created users can be deleted (created_by_admin = true)
  - **SECURITY:** Admin cannot delete their own account
  - UI: Trash icon button in user table with AlertDialog confirmation
  - Handles concurrent deletion gracefully (refreshes list in finally block)
  - data-testid attributes: `button-delete-user-{id}`, `button-confirm-delete`

- **25.11.2025:** Admin user management security improvements:
  - **SECURITY:** Admin panel now only shows users created by admin (not self-registered users)
  - Added `created_by_admin` flag to database (protects user privacy from admin account compromise)
  - New `POST /api/users` endpoint for admin-only user creation
  - `GET /api/users` now filters `WHERE created_by_admin = true`
  - Self-registered users via `/api/auth/register` remain invisible in admin panel
  
- **25.11.2025:** Password change functionality added:
  - New `PATCH /api/auth/password` endpoint with bcrypt verification and rate limiting (5 attempts/15 min)
  - `ChangePasswordModal` component with 3-field form (current, new, confirm passwords)
  - "Сменить пароль" button in trainer header (authenticated users only)
  - Security logging for PASSWORD_CHANGE_SUCCESS/FAILED events
  - `data-testid="button-open-change-password"` for Metrika goal tracking

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
    - `/api/auth/*`: Handles user registration, login, token validation, and password changes.
      - `PATCH /api/auth/password`: Secure password change with current password verification, rate limiting (5 attempts/15 min), and security logging.
    - `/api/payment/*`: Ready for payment gateway integration (e.g., YooKassa).
- **Security:** JWT tokens and middleware protect routes. Rate limiting prevents brute-force attacks. Security events logged via `securityLogger`.

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
- **Analytics:** Yandex Metrika (ID 105483627) — **Fixed 25.11.2025**:
  - **CSP DISABLED** in `server/index.ts` (Replit infrastructure overrides CSP headers)
  - **LIMITATION:** Replit infrastructure adds `X-Frame-Options: SAMEORIGIN` at reverse proxy level — cannot be overridden
  - **SOLUTION:** Use JavaScript API for goals instead of "Element selector" mode
  - Metrika script in `index.html` `<head>` with `ssr:true`, webvisor, clickmap, ecommerce, accurateTrackBounce, trackLinks
  - `<noscript>` pixel in `<body>` styled via `.ym-pixel` CSS class
  - **Goals tracking via JavaScript API** (`src/lib/metrika.ts`):
    - `button_start_free` — click "Начать бесплатно"
    - `button_login` — click "Войти"
    - `button_unlock_premium` — click "Открыть доступ за 790₽"
    - `login_success` — successful login
    - `register_success` — successful registration
    - `password_change_success` — successful password change
  - **Setup in Metrika:** Create goals with type "JavaScript-событие" and matching identifiers
- **UI Library:** Shadcn/UI.
- **CSS Framework:** Tailwind CSS.
- **Image Hosting:** All images for the simulator (e.g., `roses.png`, `tulips.png`, `box-composition.png`) are stored locally within `attached_assets/`.