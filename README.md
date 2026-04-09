# Secret Message - Frontend

A secure and modern web application for sharing encrypted messages that expire automatically. Built with security and user experience in mind.

## 🚀 Features

- **Secure Message Sharing**: Create messages that are protected by a unique 6-digit access code.
- **Auto-Expiration**: Messages can be set to expire after a specific duration (10m, 1h, 1d, etc.).
- **Rich Text Support**: Full-featured message editor powered by Quill.
- **Authentication**: Secure login and signup with Google (Firebase) and Email/Password.
- **Modern UI/UX**: Premium design using Tailwind CSS 4 and Shadcn UI components.
- **Real-time Feedback**: Interactive notifications and toasts for seamless user interaction.
- **Dark Mode Support**: Built-in support for theme switching.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth), [Jose](https://github.com/panva/jose) (JWT)
- **Forms**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Toasts**: [Sonner](https://sonner.stevenly.me/)

## 📂 Project Structure

```text
src/
├── app/            # Next.js App Router pages and layouts
├── components/     # Reusable UI components (Shadcn + Custom)
├── hooks/          # Custom React hooks (Data fetching, etc.)
├── layouts/        # Page layout components
├── lib/            # Utility functions and configurations
├── services/       # API service layers
├── store/          # Zustand state management
└── types/          # TypeScript definitions
```

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm / pnpm / yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd secret-message/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License

This project is licensed under the MIT License.
