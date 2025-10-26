// MongoDB Configuration Example
// Copy this configuration and create an .env file with these values

const mongodbConfig = {
  // MongoDB Connection String Examples:
  
  // For local MongoDB (default):
  // DATABASE_URL="mongodb://localhost:27017/pixshop"
  
  // For MongoDB Atlas (cloud):
  // DATABASE_URL="mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority"
  
  // For MongoDB with authentication:
  // DATABASE_URL="mongodb://username:password@localhost:27017/pixshop?authSource=admin"
  
  // Additional environment variables needed:
  NEXTAUTH_URL: "http://localhost:3000",
  NEXTAUTH_SECRET: "your-secret-key-change-this-in-production",
  JWT_SECRET: "your-jwt-secret-change-this-in-production"
};

module.exports = mongodbConfig;
