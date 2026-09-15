export const environment = {
  production: true,
  // Netlify proxies this same-origin path to the Render API. This prevents
  // browsers from blocking requests when the backend CORS allow-list differs
  // from the deployed Netlify site URL.
  apiUrl: '/api'
};
