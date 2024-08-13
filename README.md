# To Do

- Implement OAuth2 for third-party login providers: Add support for logging in with Google, Facebook, GitHub, etc.
- Implement audit logs for security-sensitive actions: Track and log actions like account deletions, role changes, and 2FA setups for security audits.
- Add a terms of service and privacy policy: Create and enforce terms of service and privacy policy pages.

# Completed

- Added login page.
- Added registration page.
- Added forgot password page.
- Added reset password functionality.
- Added show/hide password feature.
- Added Api key authentication for sso when added.
- Added 2FA functionality.
- Added email verification on registration: Send verification emails to new users to confirm their email addresses.
- Added SSO functionality: Users can now use this auth server on any other application.

# How do i use sso on my application?

Just head over to the [documentation](https://github.com/DeveloperJosh/Blues-auth-sso/blob/main/README.md)

# Cloning the repository

```bash
git clone https://github.com/DeveloperJosh/Blues-auth.git 
```

# Making .env file

```plaintext
MONGODB_URI="mongodb://localhost:27017/Blues-auth"
JWT_SECRET="secret"
EMAIL_USER="your-email"
EMAIL_PASS="your-password"
EMAIL_HOST="smtp.hostinger.com"
EMAIL_PORT=465
NEXT_PUBLIC_INTERNAL_SECRET_TOKEN="secret"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

# Running the application

```bash
cd Blues-auth
npm install
npm start
```

