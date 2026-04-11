# 🎁 BitBandits Smart Registry

Welcome to the **BitBandits Smart Registry**—a next-generation, AI-driven registry management system that connects registrants and guests seamlessly. Eliminate duplicates, prevent concurrent purchases seamlessly with dynamic concurrency locks, and leverage AI to build the perfect gift list.

## 🌟 Key Features

1. **🤖 AI-Curated Registries**  
   We integrate with the **Google Gemini Pro API** via our Flask backend. Given simple user context (theme, budgets, preferences), the AI autonomously generates a perfectly matched, structured list of high-quality products distributed across priority brackets.

2. **🔒 Strict Concurrency Locking**  
   Gone are the days of two guests accidentally buying the same $300 blender simultaneously. 
   - When a guest clicks "Buy", our backend assigns a **5-minute Hard Lock** (Amber status) to block simultaneous transactions.
   - If they complete the transaction, the lock is permanently sealed (🔴 **Gifted**).
   - If the timer expires or they cancel, the lock vanishes gracefully, returning the item to the global pool (🟢 **Available**).

3. **🤝 Group Gifting / Partial Contributions**  
   Can't afford the $500 grill? The checkout modal includes a real-time sliding text input for *Custom Contributions*. 
   - Multiple guests can sequentially contribute to the same premium gift. 
   - The UI natively displays real-time math of exactly how much money remains required.
   - Once `total_contribution` precisely hits the target amount, the system natively triggers the auto-locking pipeline shutting out future buyers.

4. **👤 Precision Ledger Tracking**  
   All interactions, from partial contributions to full lockouts, natively read and stash the buyer's `user_id` inside the PostgreSQL arrays (`bought_by` and `locked_by`). Our React Native Context efficiently pipes this to the frontend, displaying: *"Being viewed by: Guest Name"* or *"Bought by: Person 1, Person 2"*.

5. **✨ Frictionless Glassmorphic UI**  
   Built utilizing React Native (Expo). The application features a rich, animated onboarding pipeline, dynamic React-Navigation param cascades identifying the user without complex token states, and gorgeous fading interactions masking heavy backend requests.

---

## 🏗️ Architecture

- **Frontend Core**: React Native (built heavily in Expo)
- **Backend API**: Python API utilizing `Flask` (hosted natively in `Questionnaire.py`)
- **Database Backend**: Supabase (PostgreSQL server containing tables for `users`, `products`, `registries`, and `registry_items`)
- **Server Communication Flow**: RESTful JSON transmissions.

---

## 🚀 Setup & Installation

Follow these steps to replicate the environment flawlessly on your local machine:

### 1. Database Configuration (Supabase)
Ensure your PostgREST database features these critical constraints:
- `users`: Contains `user_id` (uuid) identifying individual registrants and logged-in guests.
- `registry_items`: The most critical table enforcing string checking constraints on the `status` column mapping exclusively to `AVAILABLE`, `RESERVED`, and `PURCHASED` to ensure absolute lock safety!

### 2. Backend Initialization (Flask)
Move into your backend directory and power up the Python services:

```bash
cd backend/models
# Ensure you have your .env containing:
# SUPABASE_URL=...
# SUPABASE_KEY=...
# GEMINI_API_KEY=...

pip install flask flask_cors supabase google-generativeai python-dotenv
python Questionnaire.py
```
> The local machine opens traffic on `http://127.0.0.1:5000`.

### 3. Frontend Initialization (Expo)
Boot the Expo development environment natively.

```bash
cd frontend/
npm install
npm start
```

## 👋 Contributions & Maintenance
This repository has been thoroughly patched with deep session IDs, strict route management, and backend safety hooks ensuring no collision across states. For modifications targeting the checkout system, always ensure you respect the UI color-coding constraints linked within `GuestRegistryScreen.js`!