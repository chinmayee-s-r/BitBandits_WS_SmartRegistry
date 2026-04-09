# Smart Registry Architecture & App Flow

## Overview
Smart Registry is a mobile-first MVP leveraging AI to guide registry building, with real-time item locking via WebSockets and Supabase for data persistence.

## App Flow
1. **Onboarding & Auth Flow**
   - `Onboarding1` - `Onboarding3`: Explains AI features and real-time locking.
   - `LoginScreen` / `RegisterStep1-3`: User authentication via Supabase.

2. **AI Registry Generation**
   - User inputs their event details (e.g., Baby Shower, Wedding) and preferences.
   - The Frontend calls the backend AI routes (`backend/routes/ai.py`).
   - `ai_service.py` uses prompt templates (schema in `shared/schema.json`) to generate tailored registry items.

3. **Registry View & Real-time Locking**
   - `RegistryScreen`: Displays recommended `ProductCard` components.
   - Users browse items. Real-time updates prevent duplicates using Redis `lock_service.py` via WebSockets.
   - `StatusBadge` dynamically updates (Available, Locked, Purchased).

## Backend (Flask)
- **Routes (`backend/routes/`):**
  - `/auth`: Handle authentication endpoints.
  - `/ai`: Handle LLM generation prompts.
  - `/registry`: Handle registry CRUD and locking.
- **Services (`backend/services/`):**
  - `ai_service.py`: LLM interactions.
  - `registry_service.py`: Supabase database operations.
  - `lock_service.py`: Redis-based distributed lock for items.

## Frontend (React Native / Expo)
- **State Management:** `context` or `redux`.
- **Navigation:** `navigation/AppNavigator.js` handling stack/tab routing.
- **Styles/UI:** Core constants in `constants/colors.js`.
