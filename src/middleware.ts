import withAuth from "next-auth/middleware";



export default withAuth({
  pages: {
    signIn: "/login", // custom login page
  },
});


export const config = {
  matcher: [
    "/orders/:path*",
    "/menu/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/product/:path*",
    "/admin/:path*",
    "/settings/:path*",
  ],
};
