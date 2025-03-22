import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  isPublicRoute,
} from "@/routes";
import { currentRole } from "./lib/auth";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  if (isApiAuthRoute) return null;
  const isAdminDashboard = nextUrl.pathname.startsWith("/admin");

  // if (isLoggedIn && nextUrl.pathname === "/appointment-booking") {
  //   return Response.redirect(new URL("/appointment-booking/date", nextUrl));
  // }

  if (isLoggedIn && isAdminDashboard) {
    const userRole = (await currentRole()) || "";
    const allowedRoles = ["SUPER_ADMIN", "ADMIN", "EDITOR"];
    if (!allowedRoles.includes(userRole)) {
      return Response.redirect(new URL("/", nextUrl));
    }
  }
  const isUserProfile = nextUrl.pathname.startsWith("/profile");
  if (!isLoggedIn && isUserProfile) {
    return Response.redirect(new URL("/auth", nextUrl));
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    return Response.redirect(new URL(`/auth`, nextUrl));
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
