// import type { NextAuthConfig } from 'next-auth';

// export const authConfig = {
//     pages: {
//         signIn: '/login',
//     },
//     callbacks: {
//         authorized({ auth, request: { nextUrl } }) {
//             const isLoggedIn = !!auth?.user;
//             const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
//             if (isOnDashboard) {
//                 if (isLoggedIn) return true;
//                 return false; // Redirect unauthenticated users to login page
//             } else if (isLoggedIn) {
//                 return Response.redirect(new URL('/dashboard', nextUrl));
//             }
//             return true;
//         },
//     },
//     providers: [], // Add providers with an empty array for now
// } satisfies NextAuthConfig;

import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        // Add role to session
        jwt({ token, user }) {
            if (user) token.role = user.role;
            return token;
        },
        session({ session, token }) {
            if (token && token.role !== undefined) session.user.role = token.role as string;
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const userRole = auth?.user?.role;

            // Check route types
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnUserRoute = nextUrl.pathname.startsWith('/dashboard/user');

            // Not logged in - redirect to login
            if (!isLoggedIn && (isOnAdmin || isOnDashboard)) {
                return false;
            }

            // Logged in users
            if (isLoggedIn) {
                // Admin can access everything
                if (userRole === 'admin') {
                    // Redirect admin from login to admin page or dashboard
                    if (nextUrl.pathname === '/login') {
                        return Response.redirect(new URL('/dashboard', nextUrl));
                    }
                    return true;
                }

                // Regular users can only access /dashboard/user routes
                if (userRole === 'user') {
                    if (isOnAdmin || (isOnDashboard && !isOnUserRoute)) {
                        return Response.redirect(new URL('/dashboard/user', nextUrl));
                    }

                    // Redirect user from login to their dashboard
                    if (nextUrl.pathname === '/login') {
                        return Response.redirect(new URL('/dashboard/user', nextUrl));
                    }
                }
            }

            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;