# MongoDB Migration Guide for PixShop

## Overview
Your PixShop NextJS application has been successfully migrated from SQLite to MongoDB. This guide outlines the changes made and provides instructions for setup and usage.

## Migration Summary

### 1. Database Configuration
- **Database**: Changed from SQLite to MongoDB
- **Connection**: Use MongoDB connection string in `.env` file
- **ORM**: Prisma configured for MongoDB with proper schema

### 2. Schema Changes
- All `Int @id` fields converted to `String @id @default(auto()) @map("_id") @db.ObjectId`
- Decimal types changed to Float (MongoDB limitation)
- Many-to-many relations converted to array fields (MongoDB style)
- Added `@db.ObjectId` decorators for foreign key references

### 3. API Routes Updated
The following API routes have been updated for MongoDB compatibility:
- `/api/products/*` - Product management
- `/api/cart/*` - Shopping cart operations
- `/api/categories/*` - Category management
- `/api/admin/categories/*` - Admin category operations
- Authentication routes remain compatible

### 4. Key Changes Made
- Added MongoDB ObjectId validation utilities
- Updated all `parseInt(id)` calls to handle ObjectId strings
- Changed field references from `assignProductAttributeId: 0` to `assignProductAttributeId: ""`
- Updated seed script for MongoDB compatibility

## Setup Instructions

### 1. Install MongoDB
Choose one of the following options:

#### Local MongoDB:
```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# Windows
# Download installer from https://www.mongodb.com/try/download/community
```

#### MongoDB Atlas (Cloud):
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string from the cluster dashboard

### 2. Configure Environment
Create a `.env` file in the project root:

```env
# For local MongoDB
DATABASE_URL="mongodb://localhost:27017/pixshop"

# For MongoDB Atlas
# DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/pixshop?retryWrites=true&w=majority"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
JWT_SECRET="your-jwt-secret-change-this-in-production"
```

### 3. Initialize Database
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to MongoDB
npx prisma db push

# Seed the database
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

## MongoDB-Specific Considerations

### ObjectId Handling
- All IDs are now MongoDB ObjectIds (24-character hex strings)
- Use the `isValidObjectId()` utility to validate IDs in API routes
- Example: `507f1f77bcf86cd799439011`

### Relationships
- Many-to-many relationships use arrays of ObjectIds
- Example: Product has `categoryIds: String[]` instead of a junction table

### Decimal Values
- MongoDB doesn't support Decimal type natively
- All price/amount fields converted to Float
- Consider using integers for currency (cents) in production

### Query Differences
```javascript
// Old (SQLite)
where: {
  categories: {
    some: { id: categoryId }
  }
}

// New (MongoDB)
where: {
  categoryIds: {
    has: categoryId
  }
}
```

## Troubleshooting

### Common Issues

1. **"Invalid ObjectId" errors**
   - Ensure IDs are valid 24-character hex strings
   - Use the validation utility before queries

2. **Connection refused**
   - Check MongoDB is running: `sudo systemctl status mongod`
   - Verify connection string in `.env`

3. **Schema push fails**
   - Ensure MongoDB is accessible
   - Check database permissions

### Testing Connection
Run the included test script:
```bash
node test-mongodb.js
```

## Next Steps

1. Update any custom queries in your codebase
2. Test all CRUD operations thoroughly
3. Consider adding MongoDB indexes for performance
4. Set up MongoDB backups
5. Configure MongoDB security (authentication, network access)

## Additional Resources

- [Prisma MongoDB Documentation](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
