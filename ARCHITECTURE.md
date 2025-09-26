# Architecture Decisions Document (ADD)

## Project Overview

**HIPAA Testing** is a secure image management system built with NestJS that provides AI-powered image analysis capabilities. The system is designed with HIPAA compliance considerations and implements comprehensive data isolation through Row Level Security (RLS).

---

## Technology Stack

### Backend Framework
- **Choice**: NestJS (Node.js)
- **Rationale**: 
  - Enterprise-grade TypeScript framework
  - Built-in dependency injection and modular architecture
  - Excellent testing support
  - Strong typing with TypeScript
  - Decorator-based architecture for clean code organization

### Database
- **Choice**: PostgreSQL with Prisma ORM
- **Rationale**:
  - **PostgreSQL**: Superior for complex queries, JSON support, and Row Level Security
  - **Prisma**: Type-safe database access, excellent migration system, and auto-generated types
  - Native support for array fields (tags, colors)
  - Strong ACID compliance for healthcare data

### AI Service Integration
- **Current Choice**: Cloudinary
- **Rationale**:
  - All-in-one solution (storage + AI analysis)
  - Built-in image transformations and optimizations
  - Reliable uptime and global CDN
  - Comprehensive AI features (tagging, captioning, color analysis)
  - Cost-effective for combined storage and processing needs

### Authentication
- **Choice**: JWT with Passport.js
- **Rationale**:
  - Stateless authentication suitable for API-first architecture
  - Industry standard with good security practices
  - Flexible expiration and refresh token strategies
  - Compatible with frontend frameworks

---

## Architectural Patterns

### 1. Modular Architecture

```
src/
├── modules/
│   ├── auth/          # Authentication & authorization
│   ├── user/          # User management
│   ├── image/         # Core image operations
│   └── cloudinary/    # AI service integration
├── prisma/            # Database service
├── common/            # Shared DTOs and utilities
└── main.ts           # Application bootstrap
```

**Benefits**:
- Clear separation of concerns
- Maintainable and testable code
- Easy to extend with new features
- Domain-driven design principles

### 2. Repository Pattern (via Prisma)

**Implementation**: PrismaService acts as a repository abstraction
**Benefits**:
- Database vendor independence
- Centralized query logic
- Easy testing with mock services
- Type-safe database operations

### 3. Service Layer Pattern

Each module implements a service layer that:
- Contains business logic
- Coordinates between repositories and external services
- Handles data transformation and validation
- Manages transaction boundaries

---

## Data Architecture

### Database Schema

```sql
Users (1) -----> (N) Images (1) -----> (1) ImageMetadata
```

**Key Design Decisions**:

1. **Separate Metadata Table**:
   - Normalizes AI analysis data
   - Allows for metadata evolution without affecting core image records
   - Enables complex querying on AI-generated fields

2. **Array Fields for Tags and Colors**:
   - PostgreSQL native array support
   - Efficient storage and querying with `@>`, `&&` operators
   - No need for junction tables

3. **CUID for Primary Keys**:
   - URL-safe, collision-resistant identifiers
   - Better than auto-incrementing integers for API exposure
   - Enables distributed systems in future

### Row Level Security (RLS)

**Implementation**: PostgreSQL RLS policies ensure data isolation
**Benefits**:
- Database-level security enforcement
- HIPAA compliance through data isolation
- Protection against application-level security bugs
- Multi-tenant architecture support

```sql
-- Example policy (from rls_policies_images.sql)
CREATE POLICY user_images_policy ON images
  FOR ALL TO authenticated_users
  USING (user_id = current_setting('rls.user_id')::text);
```

---

## API Design

### RESTful Endpoints

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/images?page=1&limit=12&color=blue&search=nature
POST   /api/images/upload
GET    /api/users/profile
```

**Design Principles**:
- RESTful resource naming
- Consistent response formats
- Pagination for large datasets
- Query parameter filtering
- HTTP status code compliance

### Request/Response Format

```typescript
// Standardized response wrapper
{
  "success": true,
  "data": {...},
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 12,
    "totalPages": 13
  }
}
```

---

## Security Architecture

### Authentication Flow

1. User submits credentials to `/api/auth/login`
2. Server validates against bcrypt-hashed passwords
3. JWT token issued with user ID and email
4. Subsequent requests include `Authorization: Bearer <token>`
5. JWT strategy validates and extracts user context

### Data Protection

1. **Password Security**: bcrypt with salt rounds
2. **JWT Security**: Configurable secret and expiration
3. **CORS Protection**: Whitelist-based origin validation
4. **Input Validation**: Class-validator DTOs
5. **Database Security**: RLS policies and prepared statements

### File Upload Security

1. **File Type Validation**: Multer configuration limits
2. **File Size Limits**: Configurable upload limits
3. **Virus Scanning**: Can be added via Cloudinary or separate service
4. **Content Validation**: Image format verification

---

## AI Processing Architecture

### Current Implementation (Cloudinary)

```typescript
// Upload pipeline
File Upload → Cloudinary Processing → Database Storage
    ↓             ↓                      ↓
Buffer      AI Analysis               Structured Data
    ↓         (tags, colors,              ↓
Stream        description)           Prisma Transaction
```

**Processing Options**:
- Auto-tagging with confidence threshold (0.6)
- Color extraction (top 3 dominant colors)
- Image captioning via Google's AI
- Categorization using Google tagging

### Alternative Architecture (Future)

```typescript
// Microservice approach
File Upload → Storage Service → AI Queue → AI Processing → Database Update
    ↓             ↓               ↓           ↓              ↓
Local/S3      Immediate         Redis/SQS   External API   Async Update
```

---

## Performance Considerations

### Database Optimization

1. **Indexing Strategy**:
   - B-tree indexes on foreign keys
   - GIN indexes on array fields (tags, colors)
   - Composite indexes for common query patterns

2. **Query Optimization**:
   - Prisma's efficient query generation
   - Pagination to limit result sets
   - Selective field loading with `include`

### Caching Strategy (Future Enhancement)

1. **Application Level**: Redis for session and query caching
2. **Database Level**: PostgreSQL query plan caching
3. **CDN Level**: Cloudinary's global CDN for images

### File Processing

1. **Async Processing**: Background jobs for AI analysis
2. **Error Handling**: Retry mechanisms for failed processing
3. **Status Tracking**: Processing status in metadata table

---

## Scalability Architecture

### Current State (Monolith)
- Single NestJS application
- All modules in one deployable unit
- Suitable for MVP and early growth

### Future Scaling Options

#### Horizontal Scaling
```
Load Balancer → [App Instance 1, App Instance 2, App Instance N]
                           ↓
                   Shared Database + Redis
```

#### Microservices Evolution
```
API Gateway → [Auth Service, Image Service, AI Service, User Service]
                     ↓
              [Database Per Service]
```

#### Event-Driven Architecture
```
Image Upload → Event Bus → [AI Service, Notification Service, Analytics Service]
```

---

## Error Handling Strategy

### Layered Error Handling

1. **Validation Layer**: Class-validator DTOs
2. **Service Layer**: Business logic errors
3. **Database Layer**: Constraint violations
4. **External API Layer**: Third-party service errors
5. **Global Filter**: Consistent error responses

### Error Categories

```typescript
// Standard error format
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid file format",
    "details": {...}
  }
}
```

---

## Testing Architecture

### Testing Strategy

1. **Unit Tests**: Service and utility function testing
2. **Integration Tests**: Module-level testing with real database
3. **E2E Tests**: Full application flow testing
4. **Contract Tests**: API endpoint validation

### Test Database Strategy

```typescript
// Separate test database
DATABASE_URL_TEST="postgresql://test:test@localhost:5432/hipaa_testing_test"
```

---

## Deployment Architecture

### Current Deployment Options

1. **Development**: Local with Docker Compose
2. **Staging**: Heroku/Railway with managed PostgreSQL
3. **Production**: AWS/GCP with managed services

### Container Strategy

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
# Build application
FROM node:18-alpine AS runner
# Production runtime
```

### Environment Management

- **Development**: `.env` files
- **Staging**: Platform environment variables
- **Production**: Secret management services (AWS Secrets Manager, etc.)

---

## Future Enhancements

### Short Term (0-3 months)
1. API documentation with Swagger/OpenAPI
2. Enhanced error logging and monitoring
3. Rate limiting implementation
4. Image processing status tracking

### Medium Term (3-6 months)
1. Real-time notifications (WebSocket/Server-Sent Events)
2. Advanced image search (similarity, facial recognition)
3. Batch processing capabilities
4. Performance monitoring and analytics

### Long Term (6+ months)
1. Microservices architecture migration
2. Advanced AI features (object detection, scene analysis)
3. Multi-tenant architecture
4. HIPAA compliance certification
5. Mobile API optimization

---

## Decision Log

| Date | Decision | Rationale | Status |
|------|----------|-----------|--------|
| 2024-09 | Choose NestJS over Express | Enterprise features, TypeScript support | ✅ Implemented |
| 2024-09 | Use Cloudinary for AI | All-in-one solution, cost-effective | ✅ Implemented |
| 2024-09 | PostgreSQL + Prisma | Complex queries, RLS support | ✅ Implemented |
| 2024-09 | JWT Authentication | Stateless, API-friendly | ✅ Implemented |
| TBD | Add Redis Caching | Performance optimization | 🔄 Planned |
| TBD | Implement Background Jobs | Async processing | 🔄 Planned |

---

## Conclusion

This architecture provides a solid foundation for a secure, scalable image management system with AI capabilities. The modular design allows for incremental improvements and technology evolution while maintaining HIPAA compliance considerations throughout the system design.
