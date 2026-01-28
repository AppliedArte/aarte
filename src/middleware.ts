import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const protectedPaths = ["/chat", "/signup"];
  const isProtectedRoute = protectedPaths.some((path) =>
    nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL("/auth/signin", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: ["/chat/:path*", "/signup/:path*"],
};
