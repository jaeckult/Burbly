# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your Burbly application.

## Prerequisites

1. A Google Cloud Console account
2. A Google OAuth 2.0 Client ID

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"
6. Choose "Web application" as the application type
7. Add your authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `http://localhost:3001` (for frontend development)
8. Add your authorized redirect URIs:
   - `http://localhost:3000/api/auth/google`
   - `http://localhost:3001/api/auth/google`
9. Copy the Client ID

## Step 2: Backend Environment Setup

Create a `.env` file in your `backend` directory with the following variables:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Other existing variables...
```

## Step 3: Frontend Environment Setup

Create a `.env.local` file in your `frontend` directory with the following variables:

```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Important:** Use the same Google Client ID for both backend and frontend.

## Step 4: Database Schema

Make sure your Prisma schema includes the Account model for OAuth providers. Your schema should have something like:

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model User {
  id             String    @id @default(cuid())
  email          String    @unique
  username       String    @unique
  passwordHash   String?
  isVerified     Boolean   @default(false)
  profilePicture String?
  accounts       Account[]
  // ... other fields
}
```

## Step 5: Install Dependencies

The required dependencies have already been installed:

### Backend Dependencies
- `google-auth-library` - For verifying Google ID tokens
- `jsonwebtoken` - For JWT token generation

### Frontend Dependencies
- `@google-cloud/local-auth` - For Google OAuth integration
- `googleapis` - Google APIs client library

## Step 6: Testing

1. Start your backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start your frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to `http://localhost:3001/login`
4. Click the "Sign in with Google" button
5. Complete the Google OAuth flow

## Troubleshooting

### Common Issues:

1. **"Invalid Google token" error**
   - Make sure your Google Client ID is correct in both backend and frontend
   - Ensure the Google+ API is enabled in Google Cloud Console

2. **CORS errors**
   - Make sure your backend CORS configuration allows requests from your frontend domain

3. **"Client ID not found" error**
   - Verify that the Google Client ID is properly set in your environment variables
   - Restart your development servers after changing environment variables

4. **Database errors**
   - Run `npx prisma migrate dev` to ensure your database schema is up to date
   - Check that the Account model exists in your Prisma schema

## Security Notes

- Never commit your `.env` files to version control
- Use strong, unique JWT secrets
- Consider implementing refresh tokens for better security
- Regularly rotate your Google OAuth credentials

## Next Steps

After successful setup, you can:
1. Customize the Google Sign-In button styling
2. Add additional OAuth providers (Facebook, GitHub, etc.)
3. Implement user profile management
4. Add logout functionality
5. Implement token refresh logic 