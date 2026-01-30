# FitTrack - Mobile-First Fitness Tracking PWA

A "Mobile-First" Fitness Tracking PWA built with Vue 3, Vite, Tailwind CSS, and Vercel Serverless Functions. It integrates with Lark (Feishu) Base for data storage.

## Features

- **Mobile-First Design:** Optimized for mobile devices with a clean UI.
- **PWA Support:** Installable on iOS and Android (Add to Home Screen).
- **Lark Integration:** Securely stores data in Lark Base tables via serverless APIs.
- **Fitness Tracking:** Log Pull-ups, Push-ups, and Crunches with a smart number selector.
- **Daily Overview:** View today's total Kcal and sets at a glance.
- **History:** View and manage recent exercise records.

## Tech Stack

- **Frontend:** Vue 3, Vite, Tailwind CSS, DaisyUI, Pinia, Vue Router
- **Backend:** Vercel Serverless Functions
- **Deployment:** Vercel

## Project Structure

```
├── api/                  # Vercel Serverless Functions
│   ├── login.js          # Login endpoint
│   ├── submit-record.js  # Record submission endpoint
│   └── utils/            # Shared utilities (Lark API helper)
├── src/                  # Vue 3 Frontend
│   ├── components/       # Reusable components (e.g., NumberSelectorModal)
│   ├── router/           # Vue Router configuration
│   ├── stores/           # Pinia state management
│   ├── views/            # Page views (Login, Dashboard)
│   ├── App.vue           # Root component
│   └── main.js           # Entry point
├── public/               # Static assets
├── .env.example          # Environment variables example
└── vite.config.js        # Vite configuration (PWA, Plugins)
```

## Setup & Development

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Copy `.env.example` to `.env.local` (for local development) and `.env.production` (for production).
    Fill in your Lark credentials:

    ```env
    LARK_APP_ID=your_app_id
    LARK_APP_SECRET=your_app_secret
    LARK_MASTER_BASE_ID=your_base_id
    LARK_USER_TABLE_ID=your_table_id
    ```

3.  **Local Development (Recommended):**
    Use Vercel CLI to run both frontend and backend locally.

    ```bash
    npm run dev:vercel
    # OR directly:
    vercel dev
    ```

    *Note: Standard `npm run dev` will only start the frontend and API calls will fail without the Vercel proxy.*

4.  **Build:**

    ```bash
    npm run build
    ```

## Deployment

Deploy to Vercel with zero configuration:

```bash
vercel deploy
```

Ensure you add the Environment Variables in your Vercel Project Settings.

## Lark Base Schema

**Table A (User Config):**
- Username (Text)
- Password (Text)
- User_ID (Text)
- Target_Base_ID (Text)
- Target_Table_ID (Text)
- Nickname (Text)

**Table B (Exercise Logs):**
- User_ID (Text)
- Date (Date/Time)
- Action_Type (Text)
- Count (Number)
- Kcal_Burned (Number)
