# Brahmagupta Mathematics Club — DSU

The official website for the **Brahmagupta Mathematics Club**, Department of Engineering Mathematics, Dayananda Sagar University.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion, GSAP
- **3D**: Three.js / React Three Fiber
- **Auth**: JWT (jose) + bcryptjs
- **Icons**: Lucide React

## Getting Started

```bash
git clone https://github.com/rishushaurya/maths_website.git
cd maths_website
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ADMIN_EMAIL` | Yes | Admin login email |
| `ADMIN_PASSWORD_HASH` | Yes | Bcrypt hash of admin password (leave empty for default `admin123`) |
| `JWT_SECRET` | Yes | Random secret string for JWT signing |

## Deployment (Vercel)

This project is optimized for Vercel. Set your environment variables in Vercel project settings.

> **Note**: Admin CMS write operations use the local filesystem and will not persist on Vercel. The site serves static seed data from the `data/` directory.

## License

Private — Brahmagupta Mathematics Club, Dayananda Sagar University.
