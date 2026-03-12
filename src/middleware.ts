import withAuth from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/orders/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/admin/:path*",
    "/settings/:path*",
    "/choose-role/:path*",
    "/creator/:path*",
    "/creators/:path*",
  ],
};