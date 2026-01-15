# Life Pharmacy - Full Stack Next.js Project

A comprehensive pharmacy management system built with Next.js 16, featuring a complete admin panel and user management system.

## 🚀 Features

### Frontend
- **Modern UI** with Tailwind CSS
- **Responsive Design** for all devices
- **Authentication** with JWT tokens
- **Admin Panel** with dashboard and management tools
- **Role-based Access Control**

### Backend
- **RESTful API** with Next.js App Router
- **Multiple Database Support** (MongoDB, MySQL, PostgreSQL)
- **JWT Authentication** with secure token handling
- **Middleware Protection** for routes
- **Input Validation** with Zod schemas

### Admin Panel
- **Dashboard** with statistics and recent activities
- **User Management** with role-based permissions
- **Product Management** (CRUD operations)
- **Order Management** and tracking
- **Category Management**
- **System Settings**

## 📁 Project Structure

```
lifepharmacy/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin panel pages
│   │   ├── users/               # User management
│   │   ├── products/            # Product management
│   │   ├── orders/              # Order management
│   │   └── layout.js            # Admin layout
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   └── admin/               # Admin API endpoints
│   ├── auth/                    # Authentication pages
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── globals.css              # Global styles
│   ├── layout.js                # Root layout
│   └── page.js                  # Home page
├── components/                   # Reusable components
│   ├── ui/                      # UI components
│   ├── forms/                   # Form components
│   ├── layout/                  # Layout components
│   └── admin/                   # Admin-specific components
├── lib/                         # Utility libraries
│   ├── auth/                    # Authentication utilities
│   ├── db/                      # Database configurations
│   ├── utils/                   # General utilities
│   └── validations/             # Input validation schemas
├── scripts/                     # Database scripts
│   └── seed.js                  # Database seeding script
├── hooks/                       # Custom React hooks
├── context/                     # React Context providers
├── types/                       # TypeScript type definitions
├── middleware.js                # Next.js middleware for auth
└── package.json                 # Dependencies and scripts
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB, MySQL, or PostgreSQL (configurable)
- **Authentication**: JWT, bcryptjs
- **Validation**: Zod
- **Styling**: Tailwind CSS

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lifepharmacy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your configuration
   ```

4. **Database Configuration**
   
   Choose your preferred database and configure the environment variables:

   **For MongoDB:**
   ```env
   DATABASE_TYPE=mongodb
   MONGODB_URI=mongodb://localhost:27017/lifepharmacy
   ```

   **For MySQL:**
   ```env
   DATABASE_TYPE=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=lifepharmacy
   ```

   **For PostgreSQL:**
   ```env
   DATABASE_TYPE=postgresql
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=lifepharmacy
   ```

5. **Seed the Database** (Optional)
   ```bash
   npm run seed
   ```

6. **Start the Development Server**
   ```bash
   npm run dev
   ```

## 🔐 Default Admin Credentials

After running the seed script:
- **Email**: admin@lifepharmacy.com
- **Password**: Admin@123

## 🚪 Authentication & Authorization

### User Roles
- **Super Admin**: Full system access
- **Admin**: User and content management
- **Manager**: Limited management access
- **User**: Basic user access

### Protected Routes
- `/admin/*` - Requires admin role
- `/api/admin/*` - Requires admin role
- Authentication handled by middleware

## 🛣️ API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Admin API
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - List users with pagination
- `POST /api/admin/users` - Create new user

## 📊 Database Schema

### Users Collection/Table
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['user', 'admin', 'manager', 'super_admin'],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection/Table
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  brand: String,
  stock: Number,
  sku: String (unique),
  status: Enum ['active', 'inactive', 'discontinued'],
  images: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 UI Components

Pre-built reusable components:
- **Button** - Various styles and sizes
- **Input** - Form input with validation
- **Modal** - Overlay dialogs
- **Loading Spinners**
- **Tables** - Data display with pagination

## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Configure environment variables** for production

3. **Deploy** to your preferred platform (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.
