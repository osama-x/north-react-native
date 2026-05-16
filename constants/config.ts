export const Config = {
  USE_API: true, // Set to true to use real API calls, false for dummy data
  API_BASE_URL: 'http://localhost:8000/api/v1', // Updated to include API version path
  FEATURES: {
    ENABLE_STAYS: false, // Feature flag for Stays functionality
    ENABLE_FEATURED_PLANS: false, // Feature flag for Featured Plans
  },
};
