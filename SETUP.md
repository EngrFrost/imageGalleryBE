# HIPAA Testing - Setup Instructions

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager
- Git

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hipaa-testing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/hipaa_testing"
   
   # JWT Configuration
   JWT_SECRET="your-jwt-secret-key"
   JWT_EXPIRES_IN="7d"
   
   # Cloudinary Configuration (Required for AI image processing)
   CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
   CLOUDINARY_API_KEY="your-cloudinary-api-key"
   CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
   
   # Application Configuration
   PORT=8000
   ```

## Database Setup

1. **Database Creation**
   Create a PostgreSQL database named `hipaa_testing` (or use your preferred name)

2. **Run Prisma Migrations**
   ```bash
   npx prisma migrate dev
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Optional: View Database**
   ```bash
   npx prisma studio
   ```

## Development Server

1. **Start in Development Mode**
   ```bash
   npm run start:dev
   ```

2. **Alternative Commands**
   ```bash
   # Standard start
   npm run start
   
   # Debug mode
   npm run start:debug
   
   # Production mode
   npm run start:prod
   ```

3. **Server Access**
   - API Base URL: `http://localhost:8000/api`
   - Health Check: `http://localhost:8000/api` (if implemented)

## Testing

1. **Unit Tests**
   ```bash
   npm run test
   ```

2. **End-to-End Tests**
   ```bash
   npm run test:e2e
   ```

3. **Test Coverage**
   ```bash
   npm run test:cov
   ```

4. **Watch Mode**
   ```bash
   npm run test:watch
   ```

## Code Quality

1. **Linting**
   ```bash
   npm run lint
   ```

2. **Code Formatting**
   ```bash
   npm run format
   ```

## API Endpoints Overview

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Images
- `POST /api/images/upload` - Upload images with AI processing
- `GET /api/images` - Get user's images with filtering options
- Query parameters: `limit`, `offset`, `page`, `color`, `search`, `similarTo`

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Row Level Security (RLS)

The project includes PostgreSQL RLS policies for data isolation. The `rls_policies_images.sql` file contains:
- User-level data isolation
- Secure image access controls
- Metadata protection policies

Apply RLS policies:
```bash
psql -d hipaa_testing -f rls_policies_images.sql
```

## Docker Support (Future)

The project is ready for containerization. Consider adding:
- `Dockerfile` for the application
- `docker-compose.yml` for the full stack
- Environment variable configuration for containers

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify PostgreSQL is running
   - Check DATABASE_URL format
   - Ensure database exists

2. **Cloudinary Upload Failures**
   - Verify all Cloudinary environment variables
   - Check API key permissions
   - Ensure account has sufficient credits

3. **JWT Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Validate authorization headers

4. **Port Conflicts**
   - Change PORT in .env file
   - Check for other services using port 8000

### Development Tips

1. **Prisma Schema Changes**
   ```bash
   npx prisma migrate dev --name descriptive-migration-name
   npx prisma generate
   ```

2. **Database Reset**
   ```bash
   npx prisma migrate reset
   ```

3. **View Generated Types**
   Check `generated/prisma/` directory for TypeScript types

## Next Steps

1. Set up your environment variables (see API_KEYS.md)
2. Review architecture decisions (see ARCHITECTURE.md)
3. Consider AI service alternatives (see AI_SERVICES.md)
4. Implement frontend integration
5. Add comprehensive error handling
6. Implement logging and monitoring
7. Add API documentation (Swagger/OpenAPI)
