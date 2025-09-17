// app/dashboard/user/page.tsx
'use client';

import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

// Extend the User type to include 'role'
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
  }
  interface Session {
    user?: User;
  }
}

export default function UserDashboard() {
    const { data: session } = useSession();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold">User Dashboard</h1>
            <p>Welcome, {session?.user?.name || 'User'}!</p>
            <p>Your role: {session?.user?.role}</p>
            <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white"
            >
                Log Out
            </button>
        </main>
    );
}