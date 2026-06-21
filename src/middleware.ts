import { auth } from "@/auth";

// 1. Define all the routes that require authentication
const protectedRoutes = [
  "/dashboard", 
  "/jobs", 
  "/candidates", 
  "/settings"
];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // 2. Check if the current path starts with any of the protected routes
  const isProtectedRoute = protectedRoutes.some((route) => 
    pathname.startsWith(route)
  );
  
  // 3. If it's a protected route and there is no session, redirect to login
  if (isProtectedRoute && !req.auth) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  // 4. Otherwise, let the user through
  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};