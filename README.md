├── client/                    # Frontend React application
│   ├── src/                  # Source files
│   └── index.html            # Entry HTML file
├── server/                   # Backend Express server
│   ├── utils/               # Utility functions
│   ├── index.ts             # Server entry point
│   └── routes.ts            # API routes
├── shared/                   # Shared types and utilities
```

### Essential Files
```
├── .env.example              # Example environment variables
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

### Files to Exclude (Add to .gitignore)
```
.replit
replit.nix
.env
node_modules/
dist/
*.log
.DS_Store
server/public/
vite.config.ts.*
*.tar.gz
```

## Environment Variables Required

```env
# Required
ODDS_API_KEY=your_odds_api_key
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=your_session_secret

# Optional (for PostgreSQL)
DATABASE_URL=your_database_url
```

## Development

1. Clone the repository
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
- Copy `.env.example` to `.env`
- Fill in your API keys and secrets

4. Start the development server
```bash
npm run dev