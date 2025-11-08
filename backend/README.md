# Portfolio Backend

A production-ready backend API for a portfolio website built with TypeScript, Express.js, MongoDB, and Redis.

## Features

- **Authentication & Authorization**: JWT-based auth with refresh tokens, OAuth (Google, GitHub)
- **Database**: MongoDB with Mongoose ODM, Redis for caching and rate limiting
- **File Upload**: Cloudinary integration for image/file management
- **Email Service**: Nodemailer for contact forms and notifications
- **Security**: Helmet, CORS, rate limiting, input validation, sanitization
- **Analytics**: Track page views, project views, and user interactions
- **API Documentation**: RESTful API with GraphQL support where needed
- **Logging**: Winston logger with file rotation
- **Error Handling**: Centralized error handling with custom error classes

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache/Session**: Redis
- **Authentication**: JWT, Passport.js (OAuth)
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Validation**: Express-validator, Joi
- **Security**: Helmet, express-rate-limit, express-mongo-sanitize
- **Logging**: Winston
- **Testing**: Jest (setup ready)

## Project Structure

```
src/
├── config/          # Database, logger configurations
├── controllers/     # Route controllers
├── middleware/      # Custom middleware (auth, validation, etc.)
├── models/          # Mongoose models
├── routes/          # Express routes
├── services/        # Business logic services
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── server.ts        # Main server file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Redis
- Cloudinary account
- Email service (Gmail, SendGrid, etc.)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   - Database URLs
   - JWT secrets
   - OAuth credentials
   - Cloudinary credentials
   - Email service credentials

5. Start development server:
   ```bash
   npm run dev
   ```

### Environment Variables

See `.env.example` for all required environment variables.

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile

#### Projects
- `GET /api/v1/projects` - Get all projects (public)
- `GET /api/v1/projects/:id` - Get single project (public)
- `POST /api/v1/projects` - Create project (admin)
- `PUT /api/v1/projects/:id` - Update project (admin)
- `DELETE /api/v1/projects/:id` - Delete project (admin)
- `POST /api/v1/projects/:id/like` - Like project (public)

#### Contact
- `POST /api/v1/contact` - Submit contact form (public, rate limited)
- `GET /api/v1/contact` - Get all contacts (admin)
- `GET /api/v1/contact/:id` - Get single contact (admin)
- `PATCH /api/v1/contact/:id/status` - Update contact status (admin)

#### Skills, Blogs, Analytics, Upload
- Routes are set up with placeholders for future implementation

### Security Features

- **Rate Limiting**: Different limits for different endpoints
- **Input Validation**: Comprehensive validation using express-validator
- **Data Sanitization**: MongoDB injection prevention
- **CORS**: Configured for specific origins
- **Helmet**: Security headers
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds

### Development

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

### Deployment

The backend is configured for deployment on:
- **AWS**: EC2, ECS, or Lambda
- **Vercel**: For serverless deployment
- **Heroku**: Traditional hosting

Make sure to:
1. Set all environment variables
2. Configure MongoDB Atlas for production
3. Set up Redis instance (AWS ElastiCache, Redis Cloud, etc.)
4. Configure Cloudinary for file storage
5. Set up email service for production

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### License

MIT License - see LICENSE file for details