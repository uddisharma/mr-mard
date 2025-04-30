/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/auth/new-verification",
  "/signup",
  "/signup-details",
  "/otp-verification",
  "/technology",
  "/about-us",
  "/blogs",
  "/contact-us",
  "/privacy-policy",
  "/how-it-works",
  "/report",
  "/terms-conditions",
  "/appointment-booking",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
  "/auth",
  "/signup",
  "/otp",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/profile";

/**
 * Function to check if a route is public
 * @param {string} route - The route to check
 * @returns {boolean} - True if the route is public, false otherwise
 */
export const isPublicRoute = (route: string): boolean => {
  if (publicRoutes.includes(route)) {
    return true;
  }
  // Check for dynamic routes
  if (
    route.startsWith("/blog/") ||
    route.startsWith("/appointment-booking/") ||
    route.startsWith("/api/")
  ) {
    return true;
  }
  return false;
};
