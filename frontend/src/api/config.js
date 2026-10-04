/**
 * api/config.js
 * Central place to configure the FastAPI base URL.
 * Change VITE_API_URL in .env to switch environments.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000'
