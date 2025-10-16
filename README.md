# 🏈 HailMaryTV

HailMaryTV is a YouTube-style video platform focused on NFL content.  
It integrates with **Google OAuth2** and **YouTube Data API v3** to allow users to authenticate, search, view, and upload videos directly to their own YouTube channels.

---

## 🚀 Project Overview

This project was developed as part of a technical challenge that required:

### ✅ Expected Requirements

- [x] Provide a mechanism for users to **search YouTube videos**
- [x] Include a **home page** displaying relevant video content
- [x] Implement a **state management structure** for application logic
- [x] Maintain a **search history** stored locally (persistent client-side state)

### ✨ Extra Requirements

- [x] Enable **user registration/login** using **YouTube OAuth2**
- [x] Allow **video uploads** directly to the **YouTube Data API v3**

---

## 🧠 Architectural Decisions

### 1. **Feature-Based Architecture (Ducks Pattern)**

The project follows a **feature-based architecture**, also known as the **Ducks Pattern** — a structure promoted by the Redux community that keeps each domain (or feature) self-contained.

```
src/
 ├─ app/               # Redux store and typed hooks
 ├─ assets/            # Static assets and media
 ├─ components/        # Atomic Design components (UI + App layout)
 ├─ constants/         # Shared config and constant files
 ├─ features/          # Redux slices (auth, videos, googleAuth...)
 ├─ hooks/             # Custom React hooks
 ├─ lib/               # External service integrations (Google API)
 ├─ pages/             # Page-level routes (HomePage, TeamPage, NotFound)
 ├─ types/             # Global TypeScript types
 ├─ utils/             # Helper functions
```

This structure allows each feature (e.g. `auth`, `videos`, `googleAuth`) to include its own slice, thunks, and types —  
reducing coupling and simplifying long-term scalability.

---

### 2. **Redux Toolkit for State Management**

The entire app state is handled using **Redux Toolkit (RTK)**, providing:

- Simplified boilerplate-free reducers
- Built-in support for **createAsyncThunk**
- Centralized and strongly typed store (`app/store.ts`)
- Typed hooks (`useAppSelector`, `useAppDispatch`)

This approach ensures predictable state flow, clear debugging, and consistency across the app.

---

### 3. **Atomic Design System**

All reusable UI building blocks follow **Atomic Design** principles:

```
src/components/ui/
```

This structure organizes the interface into:

- **Atoms** (buttons, modals, inputs)
- **Molecules** (composite components like cards)
- **Organisms** (sections like FeaturedSection, VideoUpload)

This guarantees **design consistency**, and **reusability** across the entire project.

---

### 4. **Visual System — HSL Tokens with TailwindCSS**

The design system is powered by **TailwindCSS**, configured with **HSL color tokens** to ensure a stable and themeable palette.

Example from `index.css`:

```css
:root {
  --background: 210 20% 98%;
  --foreground: 220 15% 15%;
  --primary: 220 45% 25%;
}
```

Using HSL enables fine-tuning of saturation, lightness, and hue for consistent theming — ideal for light/dark mode transitions.

---

### 5. **Hooks and Utilities**

Custom hooks (e.g. `useIsMobile`, `useToast`) provide reusable logic extracted from UI components:

- `useIsMobile` – Responsive detection using `matchMedia`
- `useToast` – Global toast notification system using Radix UI + internal reducer

---

### 6. **Integration with Google OAuth & YouTube API**

The app communicates directly with Google services:

- **Google OAuth2** for authentication
- **YouTube Data API v3** for video search, upload, and metadata retrieval

APIs are defined in `/lib/googleAuth.ts`, using secure client-side access via environment variables (`.env`).

---

### 7. **Performance Optimizations**

- **Lazy loading** of embedded YouTube players via `IntersectionObserver`
- **Framer Motion** animations for smooth transitions
- **Local persistence** for user search history and session data

---

## 🧩 Tech Stack

| Layer               | Technology                          |
| ------------------- | ----------------------------------- |
| Framework           | React 18 + TypeScript               |
| State Management    | Redux Toolkit                       |
| UI Library          | Shadcn/UI + TailwindCSS             |
| Animations          | Framer Motion                       |
| Auth / API          | Google OAuth2 + YouTube Data API v3 |
| HTTP Client         | Axios                               |
| Icons               | Lucide React                        |
| Toast Notifications | Radix UI + Sonner                   |
| Build Tool          | Vite                                |

---

## ⚙️ Environment Variables

You must define these variables in a `.env` file at the project root:

```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
VITE_API_BASE_URL=https://www.googleapis.com
```

---

## 🧱 Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Run in development mode
npm run dev

# 3. Build for production
npm run build
```

---

## 💻 Author Notes

This project was developed by **Milton Rodrigues**, Frontend Engineer.

It was built with scalability, maintainability, and design coherence in mind combining **modern React architecture**, **functional UI composition**, and **Google API integration**.

---

## 📜 License

This project is for educational and demonstration purposes only.  
All rights to the YouTube API and branding belong to **Google LLC** and **NFL**.
