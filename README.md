# Portfolio Website - Full Stack Application

A complete portfolio website with admin dashboard built using modern web technologies. Features a dark theme, responsive design, and comprehensive content management system.

## 🚀 Features

### Frontend (Client)
- **Modern Design**: Dark theme with responsive layout
- **Portfolio Showcase**: Project gallery with detailed views
- **Blog System**: Article listing and individual blog posts
- **About Section**: Professional profile with skills and experience
- **Contact Form**: Functional contact form with validation
- **Interactive Elements**: Like functionality, view counters, search/filtering

### Backend (API)
- **RESTful API**: Complete CRUD operations for all entities
- **Authentication**: JWT-based auth with refresh tokens
- **OAuth Integration**: Google and GitHub login support
- **File Upload**: Cloudinary integration for image management
- **Email Service**: Nodemailer for contact form submissions
- **Security**: Input validation, sanitization, rate limiting, CORS
- **Analytics**: View tracking and dashboard statistics

### Admin Dashboard
- **Dark Theme**: Professional admin interface
- **Content Management**: Full CRUD for projects, blogs, skills, contacts
- **User Management**: Admin authentication and role-based access
- **Analytics Dashboard**: Statistics and performance metrics
- **File Management**: Image upload and management
- **Comment Moderation**: Approve/delete blog comments

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Fetch API
- **Routing**: Next.js App Router

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Authentication**: JWT + Passport.js
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Validation**: Express-validator + Joi
- **Security**: Helmet, CORS, Rate Limiting

### Database Models
- **User**: Admin authentication and profiles
- **Project**: Portfolio projects with images and metadata
- **Blog**: Articles with content, tags, and categories
- **Skill**: Technical skills with proficiency levels
- **Contact**: Contact form submissions
- **Comment**: Blog comments with moderation
- **Analytics**: View tracking and statistics

## 📁 Project Structure

```
portfolio/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, validation, security
│   │   ├── services/       # Email, upload services
│   │   └── utils/          # Helpers and utilities
│   └── package.json
├── client/                 # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # Reusable components
│   ├── lib/              # API client and utilities
│   └── package.json
├── admin/                 # Next.js admin dashboard
│   ├── app/              # Admin pages
│   ├── components/       # Admin components
│   ├── lib/             # Admin API client
│   └── package.json
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- Redis
- Cloudinary account (for image uploads)
- Email service (Gmail/SMTP)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
cp .env.local.example .env.local
# Configure API URL
npm run dev
```

### Admin Dashboard Setup
```bash
cd admin
npm install
cp .env.local.example .env.local
# Configure API URL
npm run dev
```

## 🔐 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## 🚀 Deployment

### Backend Deployment
- Deploy to services like Railway, Render, or AWS
- Configure production environment variables
- Set up MongoDB Atlas and Redis Cloud
- Configure Cloudinary for production

### Frontend Deployment
- Deploy to Vercel, Netlify, or similar
- Configure production API URL
- Set up custom domain (optional)

## 📊 API Endpoints

### Public Endpoints
- `GET /api/v1/projects` - Get projects
- `GET /api/v1/projects/:id` - Get single project
- `POST /api/v1/projects/:id/like` - Like project
- `GET /api/v1/blogs` - Get blogs
- `GET /api/v1/blogs/:id` - Get single blog
- `GET /api/v1/skills` - Get skills
- `POST /api/v1/contact` - Submit contact form

### Admin Endpoints (Protected)
- `POST /api/v1/auth/login` - Admin login
- `POST /api/v1/projects` - Create project
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project
- `GET /api/v1/analytics/dashboard` - Dashboard stats

## 🎨 Features Implemented

### Security
- ✅ JWT Authentication with refresh tokens
- ✅ Input validation and sanitization
- ✅ Rate limiting and CORS protection
- ✅ Password hashing with bcrypt
- ✅ XSS and injection prevention

### Content Management
- ✅ CRUD operations for all entities
- ✅ Image upload with Cloudinary
- ✅ Rich text content support
- ✅ Category and tag management
- ✅ Search and filtering

### User Experience
- ✅ Responsive dark theme design
- ✅ Loading states and error handling
- ✅ Form validation with feedback
- ✅ Interactive elements (likes, views)
- ✅ Smooth navigation and transitions

### Admin Features
- ✅ Complete admin dashboard
- ✅ Analytics and statistics
- ✅ Content moderation
- ✅ User management
- ✅ File management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Portfolio Developer**
- Website: [Your Website]
- GitHub: [@yourusername]
- LinkedIn: [Your LinkedIn]
- Email: hello@portfolio.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database solution
- Cloudinary for image management
- All open-source contributors

---

**Built with ❤️ using modern web technologies**