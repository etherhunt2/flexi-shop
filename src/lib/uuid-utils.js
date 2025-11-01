/**
 * UUID utility functions
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a new UUID
 * @returns {string} A new UUID v4
 */
export function generateUUID() {
    return uuidv4();
}

/**
 * Check if a string is a valid UUID
 * @param {string} uuid - The string to validate
 * @returns {boolean} True if valid UUID format
 */
export function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

/**
 * Parse and validate UUID input
 * @param {string|object} input - UUID string or object with id/uuid
 * @returns {string|null} Validated UUID or null if invalid
 */
export function parseUUID(input) {
    if (!input) return null;

    // Handle object input (e.g., { id: '...', uuid: '...' })
    if (typeof input === 'object' && input !== null) {
        const id = input.id || input.uuid || input._id;
        return isValidUUID(id) ? id : null;
    }

    // Handle string input
    return isValidUUID(input) ? input : null;
}