# MMA Project - Next.js

A full-stack MMA fighter database application built with Next.js, featuring fighter cards, statistics, and search functionality.

## Features

- 🥊 Fighter search and card display
- 📊 Fighter statistics visualization
- 🎨 Modern UI with Tailwind CSS
- 🔥 Real-time data fetching
- 📱 Responsive design
- ⚡ Next.js App Router
- 🛡️ TypeScript support

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS
- **Icons**: Heroicons

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd mma-project-nextjs
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
# Database Configuration
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=your_database

# API Keys
RAPID_API_KEY=your_rapid_api_key
UFC_API=your_ufc_api_endpoint

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── fighters/     # Fighter endpoints
│   │   ├── health/       # Health check
│   │   └── test/         # Test endpoint
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── FighterCard.tsx
│   ├── FighterSearch.tsx
│   ├── HeroSection.tsx
│   ├── LoadingSpinner.tsx
│   ├── Navigation.tsx
│   └── ...
├── lib/
│   └── db.ts            # Database connection
└── models/              # Data models
    ├── Fighter.ts
    └── User.ts
```

## API Endpoints

- `GET /api/test` - Test API connection
- `GET /api/health` - Health check
- `POST /api/fighters` - Get fighter data

## Database Schema

The application uses PostgreSQL with the following main tables:

- `ufc_fighter` - Fighter information
- `weight_classes` - Weight class definitions  
- `ufc_weight_fighter` - Fighter stats and weight class relationships
- `app_user` - User accounts (no authentication)

## Components

### FighterCard
Displays fighter information including stats, image, and description.

### FighterSearch
Search form for finding fighters by name.

### HeroSection
Landing page hero section with branding.

### Navigation
Responsive navigation bar.

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
