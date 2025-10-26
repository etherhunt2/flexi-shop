/**
 * Utility functions for MongoDB ObjectId handling
 */

/**
 * Check if a string is a valid MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid ObjectId format
 */
export function isValidObjectId(id) {
  if (!id) return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Safely parse an ID that might be a number or ObjectId string
 * For migration compatibility
 * @param {string|number} id - The ID to parse
 * @returns {string|null} - The parsed ID or null if invalid
 */
export function parseId(id) {
  if (!id) return null;
  
  // If it's already a valid ObjectId string, return it
  if (isValidObjectId(id)) {
    return id;
  }
  
  // For backward compatibility during migration
  // Convert numeric IDs to padded strings (temporary)
  if (!isNaN(id)) {
    console.warn(`Numeric ID detected: ${id}. Consider migrating to ObjectId.`);
    return null; // Return null for numeric IDs in MongoDB
  }
  
  return null;
}

/**
 * Convert category or brand filters for MongoDB
 * @param {string} value - The filter value
 * @returns {string|null} - The ObjectId or null
 */
export function parseFilterId(value) {
  if (!value) return null;
  return isValidObjectId(value) ? value : null;
}
