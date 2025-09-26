# 🏥 Image Gallery - AI-Powered Image Management System

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="60" alt="NestJS" /></a>
  <span style="margin: 0 20px; font-size: 24px;">+</span>
  <a href="https://www.postgresql.org/" target="blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" width="60" alt="PostgreSQL" /></a>
  <span style="margin: 0 20px; font-size: 24px;">+</span>
  <a href="https://cloudinary.com/" target="blank"><img src="https://cloudinary.com/favicon.ico" width="60" alt="Cloudinary" /></a>
</p>

<p align="center">
  A secure, AI-powered image management system built with NestJS, featuring automated image analysis, tagging, and advanced search capabilities with HIPAA compliance considerations.
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="#-api-endpoints">API</a> •
  <a href="#-tech-stack">Tech Stack</a>
</p>

## 🌟 Features

- **🔐 Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **🤖 AI-Powered Analysis**: Automated image tagging, color extraction, and description generation
- **🔍 Advanced Search**: Search by tags, colors, descriptions, and image similarity
- **🏥 HIPAA Ready**: Row Level Security (RLS) policies for data isolation
- **📊 Smart Filtering**: Filter images by color, content, and metadata
- **⚡ High Performance**: Optimized queries with Prisma ORM and PostgreSQL
- **🌐 Global CDN**: Fast image delivery through Cloudinary's global network
- **🔄 Real-time Processing**: Instant AI analysis upon image upload

## 📋 Description

A comprehensive image management system that combines secure storage with intelligent AI analysis. Built for healthcare and enterprise environments where data security and advanced image processing capabilities are essential.

## 🚀 Quick Start

1. **Clone and install dependencies**
   ```bash
   git clone <your-repository-url>
   cd hipaa-testing
   npm install
   ```

2. **Set up environment**
   ```bash
   cp env.example .env
   # Edit .env with your configuration (see API_KEYS.md)
   ```

3. **Set up database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start development server**
   ```bash
   npm run start:dev
   ```

5. **Access the API**
   - API Base: `http://localhost:8000/api`
   - Upload images, get AI analysis, and search with advanced filters

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[📖 SETUP.md](./SETUP.md)** | Complete setup instructions and troubleshooting |
| **[🔑 API_KEYS.md](./API_KEYS.md)** | API keys configuration and security best practices |
| **[🏗️ ARCHITECTURE.md](./ARCHITECTURE.md)** | System architecture and design decisions |
| **[🤖 AI_SERVICES.md](./AI_SERVICES.md)** | AI service comparison and recommendations |

## 🔌 API Endpoints

### Authentication
```http
POST /api/auth/register    # Create new user account
POST /api/auth/login       # User authentication
```

### Images
```http
POST /api/images/upload    # Upload images with AI processing
GET  /api/images          # Get images with filtering options
```

**Query Parameters for GET /api/images:**
- `page` - Page number for pagination
- `limit` - Items per page (default: 12)
- `color` - Filter by dominant color (e.g., "blue", "red")
- `search` - Search in tags and descriptions
- `similarTo` - Find images similar to a specific image ID

### Users
```http
GET /api/users/profile     # Get user profile
PUT /api/users/profile     # Update user profile
```

## 🛠️ Tech Stack

### Backend
- **[NestJS](https://nestjs.com/)** - Enterprise Node.js framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[PostgreSQL](https://www.postgresql.org/)** - Advanced SQL database
- **[Prisma](https://www.prisma.io/)** - Type-safe ORM
- **[JWT](https://jwt.io/)** - Secure authentication

### AI & Storage
- **[Cloudinary](https://cloudinary.com/)** - AI-powered media management
- **Auto-tagging** - Intelligent image categorization
- **Color Analysis** - Dominant color extraction
- **Image Captioning** - AI-generated descriptions

### Security
- **Row Level Security (RLS)** - Database-level data isolation
- **bcrypt** - Password hashing
- **CORS** - Cross-origin protection
- **Input validation** - Request sanitization

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🏥 HIPAA Compliance Features

- **Data Isolation**: Row Level Security policies
- **Secure Authentication**: JWT with strong password hashing
- **Audit Trail**: Comprehensive logging (planned)
- **Access Controls**: User-based data access
- **Encryption**: In-transit and at-rest data protection

## 🌟 Key Features in Detail

### AI-Powered Image Analysis
- **Smart Tagging**: Automatically identifies objects, scenes, and concepts
- **Color Intelligence**: Extracts dominant colors for visual search
- **Content Understanding**: Generates descriptive captions
- **Similarity Search**: Find visually similar images

### Advanced Search & Filtering
```javascript
// Example API usage
GET /api/images?color=blue&search=nature&page=1&limit=10
```

### Performance Optimizations
- **Efficient Queries**: Optimized database indexes
- **CDN Delivery**: Global content distribution
- **Caching Strategy**: Planned Redis integration
- **Pagination**: Large dataset handling

## 🚀 Development & Deployment

### Development
```bash
npm run start:dev    # Watch mode with auto-reload
npm run start:debug  # Debug mode
```

### Production
```bash
npm run build        # Compile TypeScript
npm run start:prod   # Production server
```

### Docker (Planned)
```bash
docker-compose up    # Full stack deployment
```

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Core image upload and AI analysis
- ✅ User authentication and authorization  
- ✅ Advanced search and filtering
- ✅ HIPAA-ready security architecture

### Phase 2 (Upcoming)
- 🔄 Real-time notifications
- 🔄 Batch processing
- 🔄 Enhanced error handling
- 🔄 API documentation (Swagger)

### Phase 3 (Future)
- 📋 Advanced AI features (facial recognition, OCR)
- 📋 Multi-tenant architecture
- 📋 Performance analytics
- 📋 Mobile API optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Resources

- 📖 Check the [SETUP.md](./SETUP.md) for detailed setup instructions
- 🔑 Review [API_KEYS.md](./API_KEYS.md) for configuration help
- 🏗️ Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system design
- 🤖 See [AI_SERVICES.md](./AI_SERVICES.md) for AI service options

**Additional Resources:**
- [NestJS Documentation](https://docs.nestjs.com) - Framework documentation
- [Prisma Documentation](https://www.prisma.io/docs) - Database ORM guides
- [Cloudinary Documentation](https://cloudinary.com/documentation) - AI and media management

---

<p align="center">
  Made with ❤️ for secure, intelligent image management
</p>

