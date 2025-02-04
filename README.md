# Required
ODDS_API_KEY=your_odds_api_key
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=your_session_secret

# Optional (for PostgreSQL)
DATABASE_URL=your_database_url
```

## Development Dependencies

This project uses several development dependencies, including some that are Replit-specific. When deploying outside of Replit, you can handle these in two ways:

### Option 1: Keep Replit Dependencies
The following Replit-specific packages provide enhanced development features:
- `@replit/vite-plugin-shadcn-theme-json`: Theme management
- `@replit/vite-plugin-runtime-error-modal`: Error display

These packages are optional but provide useful development features. They can be kept in the project without affecting production functionality.

### Option 2: Remove Replit Dependencies
If you prefer to remove Replit-specific dependencies:

1. Remove from package.json:
```json
"@replit/vite-plugin-shadcn-theme-json"
"@replit/vite-plugin-runtime-error-modal"
```

2. Update vite.config.ts to remove Replit plugins (optional step)

## Getting Started

1. Clone the repository
```bash
git clone <your-repo-url>
cd <repo-name>
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