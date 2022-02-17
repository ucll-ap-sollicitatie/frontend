# Frontend 'Slim op sollicitatie'

Frontend repository of 'Slim op sollicitatie'.

## Prerequisites

Create a `.env.local` file in the root of the project with following content:
```
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
GOOGLE_ID="your_google_id"
GOOGLE_SECRET="your_google_secret"
AUTH_SECRET="your_random_auth_key"
JWT_SECRET="your_random_jwt_secret"
```

## Commands
```bash
# Install packages
npm install

# Start server
npm run dev

# Format project files
npm run format
```

Then, open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
