# PixShop - Next.js E-commerce Application

A modern, full-featured e-commerce application built with Next.js 15, converted from Laravel. This application provides a complete online shopping experience with user authentication, product management, shopping cart, payment processing, and comprehensive admin dashboard.

## 🚀 Features

### 🛍️ **Customer Features**
- **Product Catalog**: Browse products with advanced search, categories, brands, and filters
- **Product Details**: Detailed product pages with image galleries, reviews, and specifications
- **Shopping Cart**: Add, remove, update quantities, and manage cart items with persistent state
- **Wishlist**: Save favorite products for later with user authentication
- **User Authentication**: Secure registration, login, and session management
- **Checkout Process**: Complete checkout flow with shipping and payment options
- **Order Management**: Order confirmation and tracking
- **Responsive Design**: Mobile-first design optimized for all devices

### 🔧 **Admin Features**
- **Admin Dashboard**: Comprehensive overview with sales statistics and analytics
- **Product Management**: Add, edit, and manage products, categories, and brands
- **Order Management**: View and process customer orders
- **User Management**: Manage customer accounts and permissions
- **Inventory Tracking**: Monitor stock levels and product availability
- **Sales Analytics**: Track revenue, popular products, and performance metrics

### 🎨 **Design & UX**
- **Modern UI**: Clean, professional design with Tailwind CSS
- **Interactive Elements**: Smooth animations and hover effects
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: User-friendly error messages and validation
- **Toast Notifications**: Real-time feedback for user actions
- **Accessibility**: WCAG compliant design patterns

### 🔐 **Security & Performance**
- **Secure Authentication**: JWT-based authentication with NextAuth.js
- **Role-based Access**: Separate admin and customer access levels
- **Data Validation**: Server-side and client-side form validation
- **Image Optimization**: Next.js Image component for optimal loading
- **SEO Optimized**: Server-side rendering and proper meta tags
- **Performance**: Optimized bundle size and lazy loading

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes (Server-side)
- **Database**: SQLite with Prisma ORM (easily switchable to PostgreSQL/MySQL)
- **Authentication**: NextAuth.js with JWT strategy
- **State Management**: React Context API + SWR for data fetching
- **Styling**: Tailwind CSS with custom components
- **Icons**: Heroicons
- **Notifications**: React Hot Toast
- **Forms**: React Hook Form with validation
- **Image Handling**: Next.js Image optimization

## 📱 Pages & Routes

### Public Pages
- `/` - Homepage with featured products and categories
- `/products` - Product listing with filters and search
- `/products/[id]` - Individual product detail pages
- `/categories` - All categories overview
- `/brands` - All brands overview
- `/offers` - Special offers and deals
- `/contact` - Contact form and information
- `/auth/login` - User and admin login
- `/auth/register` - User registration

### Protected User Pages
- `/cart` - Shopping cart management
- `/wishlist` - User's saved products
- `/checkout` - Secure checkout process
- `/order-confirmation` - Order success page
- `/profile` - User profile management
- `/orders` - Order history and tracking

### Admin Pages
- `/admin` - Admin dashboard with analytics
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/users` - User management
- `/admin/settings` - System settings

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd NextJS
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

4. **Set up the database:**
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

5. **Start the development server:**
```bash
npm run dev
```

6. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 👥 Demo Accounts

### Customer Account
- **Email**: user@pixshop.com
- **Password**: user123
- **Access**: Shopping, cart, wishlist, orders

### Admin Account  
- **Email**: admin@pixshop.com
- **Password**: admin123
- **Access**: Full admin dashboard and management

## 📋 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database with sample data
- `npx prisma studio` - Open Prisma database browser
- `npx prisma db push` - Push schema changes to database

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Authentication pages
│   ├── api/               # API routes
│   ├── products/          # Product pages
│   └── ...                # Other pages
├── components/            # Reusable React components
│   ├── Layout.js          # Main layout wrapper
│   ├── Header.js          # Navigation header
│   ├── Footer.js          # Site footer
│   └── Providers.js       # Context providers
├── contexts/              # React Context providers
│   ├── CartContext.js     # Shopping cart state
│   └── WishlistContext.js # Wishlist state
├── lib/                   # Utility functions
│   ├── auth.js           # NextAuth configuration
│   └── prisma.js         # Database client
└── middleware.js          # Route protection

prisma/
├── schema.prisma          # Database schema
└── seed.js               # Sample data seeding

public/
├── placeholder-product.svg # Default product image
└── ...                    # Static assets
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)

### Shopping Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[id]` - Update cart item
- `DELETE /api/cart/[id]` - Remove cart item

### Categories & Brands
- `GET /api/categories` - List categories
- `GET /api/brands` - List brands

### Wishlist
- `GET /api/wishlist` - Get wishlist items
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/[productId]` - Remove from wishlist

### Orders
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create new order

## 🎯 Key Features Implemented

### ✅ Complete E-commerce Functionality
- Product browsing with advanced filters
- Shopping cart with persistent state
- User authentication and authorization
- Secure checkout process
- Order management system
- Admin dashboard with analytics

### ✅ Modern Development Practices
- Server-side rendering (SSR)
- API-first architecture
- Component-based design
- State management with Context API
- Form validation and error handling
- Responsive design patterns

### ✅ Performance Optimizations
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Efficient data fetching with SWR
- Optimized bundle size
- Caching strategies

### ✅ Security Features
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CSRF protection
- Secure password hashing

## 🔄 Migration from Laravel

This application was successfully converted from a Laravel-based e-commerce system to Next.js, maintaining all core functionality while improving performance and user experience:

- **Backend**: Laravel controllers → Next.js API routes
- **Frontend**: Blade templates → React components
- **Database**: Eloquent ORM → Prisma ORM
- **Authentication**: Laravel Auth → NextAuth.js
- **Styling**: Bootstrap → Tailwind CSS
- **State**: Server sessions → Client-side Context + SWR

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Other Platforms
- **Netlify**: Full-stack deployment support
- **Railway**: Database and app hosting
- **DigitalOcean**: App Platform deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Prisma for the excellent database toolkit
- NextAuth.js for authentication solution
- All open-source contributors

---

**PixShop** - A modern e-commerce solution built with Next.js 15 🚀