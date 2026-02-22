# Security Policy

## Security Fixes Implemented (February 2026)

### ✅ Fixed Issues

#### 1. **CORS Misconfiguration** (Critical)
- **Before:** `origin: true` allowed ANY origin with credentials
- **After:** Whitelist-based CORS with configurable allowed origins
- **Configuration:** Set `ALLOWED_ORIGINS` in `.env` file

#### 2. **XSS Prevention** (High)
- **Added:** HTML escaping for all user inputs (menu items, beer names, descriptions)
- **Implementation:** Custom HTML escape function in validators
- **Protected Fields:** item names, details, brewery names, beer styles

#### 3. **Password Security** (High)
- **Added:** Maximum password length (72 chars - bcrypt limit)
- **Added:** Email maximum length (255 chars)
- **Prevents:** DoS attacks via excessively long passwords

#### 4. **Cookie Security** (Medium)
- **Before:** `sameSite: 'none'` in all environments
- **After:** `sameSite: 'strict'` in production, `'lax'` in development
- **Production:** Always uses secure cookies (HTTPS only)

#### 5. **Input Validation** (Medium)
- **Added:** `available` field to validators
- **Enhanced:** Max lengths on all string inputs
- **Protected:** Price and ABV inputs with regex validation

### ✅ Existing Security Features (Already Strong)

1. **SQL Injection Prevention** - Parameterized queries everywhere
2. **Password Hashing** - bcrypt with configurable salt rounds
3. **JWT Authentication** - Tokens expire after 1 day
4. **Rate Limiting** - 5 requests per 15 minutes on auth endpoints
5. **Security Headers** - Helmet middleware enabled
6. **HttpOnly Cookies** - Session tokens not accessible via JavaScript
7. **Input Validation** - Zod schemas on all endpoints

### ⚠️ Known Issues (Low Risk)

#### Dev Dependencies Vulnerabilities
- **Issue:** 22 high severity vulnerabilities in minimatch package
- **Risk Level:** Low (dev dependencies only, not in production build)
- **Affected Packages:** eslint, jest, babel tooling
- **Status:** Documented, will fix in next major version upgrade
- **Mitigation:** These packages are only used during development and testing

## Security Best Practices

### For Development
1. Use strong, unique `APP_SECRET` (minimum 32 characters)
2. Never commit `.env` files to version control
3. Set `NODE_ENV=development` for local development
4. Use `ALLOWED_ORIGINS=http://localhost:7891` for local testing

### For Production
1. **Required:** Set `NODE_ENV=production`
2. **Required:** Use HTTPS for all connections
3. **Required:** Set strong, random `APP_SECRET` (use a password generator)
4. **Required:** Configure `ALLOWED_ORIGINS` with your production domain(s)
5. **Recommended:** Use environment-specific database credentials
6. **Recommended:** Enable database SSL connections
7. **Recommended:** Implement additional rate limiting on public endpoints
8. **Recommended:** Set up monitoring and alerting for failed auth attempts

### Additional Hardening (Optional)
- Add CSRF tokens for state-changing operations
- Implement refresh tokens for longer sessions
- Add IP-based rate limiting
- Enable audit logging for authentication events
- Implement 2FA for admin accounts
- Add account lockout after failed login attempts
- Use a secrets manager (AWS Secrets Manager, HashiCorp Vault)

## Reporting Security Issues

If you discover a security vulnerability, please email security@example.com.
Do NOT create a public GitHub issue for security vulnerabilities.

## Security Checklist for Deployment

- [ ] `NODE_ENV=production` is set
- [ ] `APP_SECRET` is strong and unique (32+ characters)
- [ ] `ALLOWED_ORIGINS` includes only your production domains
- [ ] Database uses SSL connections
- [ ] Application is behind HTTPS (use reverse proxy like nginx)
- [ ] Rate limiting is enabled
- [ ] Security headers are enabled (Helmet)
- [ ] Database credentials are secure and not hardcoded
- [ ] Regular backups are configured
- [ ] Error messages don't leak sensitive information
- [ ] Monitoring and logging are enabled

## Last Updated
February 22, 2026
