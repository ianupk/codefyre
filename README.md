# Codefyre — Browser-Based Code Editor & Snippet Sharing Platform

A browser-based code editor. Write, execute, and share code in 10 programming languages — instantly, with no setup required.

**Live Demo:** [codefyre.vercel.app](https://codefyre.vercel.app)

---

## Features

- **10 Languages** — JavaScript, TypeScript, Python, Java, Go, Rust, C++, C#, Ruby, Swift
- **Monaco Editor** — VS Code-grade editor with JetBrains Mono font, syntax highlighting, and 5 themes
- **Instant Execution** — Code runs via the OneCompiler API in milliseconds
- **stdin Support** — Pass input to your programs for interactive testing
- **Share Snippets** — Publish code to the community, star favourites, and leave comments
- **Dashboard** — Track your execution history, language usage stats, and starred snippets
- **Authentication** — Email/password auth via Better Auth
- **Responsive** — Works on desktop and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + inline styles |
| Editor | Monaco Editor (`@monaco-editor/react`) |
| Auth | Better Auth |
| Database | Neon (Postgres) via Prisma 7 |
| Code Execution | OneCompiler API |
| State | Zustand |
| Animations | Framer Motion |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) Postgres database
- A [OneCompiler API key](https://onecompiler.com/api-console)

### Installation

```bash
git clone https://github.com/ianupk/codefyre.git
cd codefyre
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# Database
DATABASE_URL=postgresql://...

# Better Auth
BETTER_AUTH_SECRET=your-32-character-secret-here
BETTER_AUTH_URL=http://localhost:3000

# OneCompiler
ONECOMPILER_API_KEY=your-api-key-here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Also create a `.env` file (required by Prisma):

```env
DATABASE_URL=postgresql://...
```

### Database Setup

```bash
npx prisma db push
npx prisma generate
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── (root)/
│   │   └── _components/     # Editor, OutputPanel, TopBar, etc.
│   ├── api/                 # API routes (execute, snippets, auth, etc.)
│   ├── dashboard/           # Dashboard page
│   ├── snippets/            # Snippets listing and detail pages
│   └── editor/              # Editor page
├── components/              # Shared components (NavigationHeader, StarButton, etc.)
├── lib/                     # Auth config (Better Auth)
├── restore/                 # Zustand store (useCodeEditorRestore)
├── types/                   # TypeScript types
└── generated/               # Prisma generated client (auto-generated, gitignored)
```

---

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Generate Prisma client + build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## Database Schema

| Table | Description |
|---|---|
| `user` | User accounts (Better Auth) |
| `session` | Active sessions (Better Auth) |
| `account` | OAuth accounts (Better Auth) |
| `verification` | Email verification tokens (Better Auth) |
| `code_executions` | Execution history per user |
| `snippets` | Shared code snippets |
| `snippet_comments` | Comments on snippets |
| `stars` | Starred snippets |

---

## License

MIT
