# API Keys and Configuration Guide

## Required API Keys

### 1. Cloudinary (Currently Implemented)

**Purpose**: AI-powered image analysis, storage, and transformation

**Required Environment Variables**:
```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"  
CLOUDINARY_API_SECRET="your-api-secret"
```

**How to Obtain**:
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Navigate to Dashboard → Account Details
3. Copy Cloud Name, API Key, and API Secret
4. **Free Tier**: 25GB storage, 25GB monthly bandwidth, 25,000 transformations

**Features Used**:
- Auto-tagging (confidence threshold: 0.6)
- Color extraction
- Image captioning
- Google-based categorization

**Configuration in Code**:
Located in `src/modules/cloudinary/cloudinary.provider.ts` and `cloudinary.service.ts`

---

### 2. PostgreSQL Database

**Purpose**: Primary data storage with Row Level Security

**Required Environment Variables**:
```env
DATABASE_URL="postgresql://username:password@host:port/database_name"
```

**Setup Options**:

**Local Setup**:
```bash
# Install PostgreSQL locally
# Create database
createdb hipaa_testing

# Connection string example
DATABASE_URL="postgresql://postgres:password@localhost:5432/hipaa_testing"
```

**Cloud Options**:
- **Neon** (Free tier: 512MB storage)
- **Supabase** (Free tier: 500MB database)
- **Railway** (Free tier with usage limits)
- **Heroku Postgres** (Free tier discontinued, paid plans available)

---

### 3. JWT Configuration

**Purpose**: Secure authentication token management

**Required Environment Variables**:
```env
JWT_SECRET="your-super-secure-random-string-min-32-chars"
JWT_EXPIRES_IN="7d"
```

**How to Generate Secret**:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64

# Using online generator (not recommended for production)
# https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

---

## Alternative AI Services Configuration

If you want to switch from Cloudinary, here are the configurations for the recommended alternatives:

### Option 1: Google Cloud Vision AI

**Environment Variables**:
```env
GOOGLE_CLOUD_PROJECT_ID="your-project-id"
GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"
# OR for JSON key content
GOOGLE_CLOUD_CREDENTIALS_JSON='{"type":"service_account",...}'
```

**Setup Steps**:
1. Create project at [console.cloud.google.com](https://console.cloud.google.com)
2. Enable Vision AI API
3. Create service account and download JSON key
4. Set billing account (required even for free tier)

**Free Tier**: 1,000 units per month for most features

### Option 2: Imagga

**Environment Variables**:
```env
IMAGGA_API_KEY="your-api-key"
IMAGGA_API_SECRET="your-api-secret"
```

**Setup Steps**:
1. Sign up at [imagga.com](https://imagga.com)
2. Navigate to Dashboard → API Keys
3. Copy API Key and Secret

**Free Tier**: 2,000 API calls per month

---

## Security Best Practices

### Environment Variable Management

1. **Never commit `.env` files**
   - Already included in `.gitignore`
   - Use `.env.example` for documentation

2. **Production Deployment**:
   ```env
   # Use strong, unique values
   JWT_SECRET="production-specific-64-char-random-string"
   
   # Use connection pooling for database
   DATABASE_URL="postgresql://user:pass@host:port/db?connection_limit=20"
   ```

3. **Key Rotation**:
   - Rotate JWT secrets periodically
   - Update API keys if compromised
   - Monitor API usage for anomalies

### API Key Security

1. **Cloudinary**:
   - Enable signed uploads for production
   - Set up upload presets with restrictions
   - Use auto-resource management

2. **Database**:
   - Use read-only credentials where possible
   - Enable SSL connections
   - Implement connection pooling

3. **Monitoring**:
   - Set up usage alerts
   - Monitor for unusual API activity
   - Log authentication failures

---

## Configuration Validation

The application includes environment validation. Missing or invalid keys will prevent startup with clear error messages.

**Startup Validation Checks**:
- Database connectivity
- Cloudinary authentication
- JWT secret presence and strength
- Required environment variables

**Health Check Endpoint** (Future Enhancement):
```typescript
// GET /api/health
{
  "status": "ok",
  "services": {
    "database": "connected",
    "cloudinary": "authenticated",
    "redis": "connected" // if implemented
  }
}
```

---

## Development vs Production

### Development Configuration
```env
# Permissive CORS
# Local database
# Verbose logging
# Auto-reload enabled
```

### Production Configuration
```env
# Restrictive CORS origins
# Managed database with SSL
# Error logging only
# Performance optimizations
# Rate limiting enabled
```

---

## Troubleshooting

### Common Issues

1. **Cloudinary "Invalid API Key"**:
   - Verify all three variables are set
   - Check for trailing spaces
   - Ensure account is verified

2. **Database Connection Failed**:
   - Check DATABASE_URL format
   - Verify database exists
   - Test network connectivity

3. **JWT Issues**:
   - Ensure JWT_SECRET is at least 32 characters
   - Check token expiration format
   - Verify secret matches between requests

### Testing API Keys

```bash
# Test database connection
npx prisma db pull

# Test Cloudinary (upload a test image via API)
# Test JWT (login via API and check token)
```

---

## Cost Estimation

### Free Tier Limits
- **Cloudinary**: 25GB storage, 25GB bandwidth/month
- **PostgreSQL (Neon)**: 512MB storage
- **Google Cloud Vision**: 1,000 API calls/month
- **Imagga**: 2,000 API calls/month

### Scaling Considerations
- Monitor usage approaching limits
- Plan for paid tier transition
- Consider alternative services for cost optimization
- Implement caching to reduce API calls
