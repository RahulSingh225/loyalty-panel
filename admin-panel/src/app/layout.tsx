import './globals.css';
import { Inter } from 'next/font/google';
import { auth, signOut } from '../auth'; // Ensure correct import
import { ToastProvider } from '@/components/toastProvider';
import { SessionProvider } from "next-auth/react";


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Admin Panel',
  description: 'Admin panel with reports',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log(auth)
  const session = await auth(); // Ensure auth is called correctly

  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider/>
        {session?.user && (
          <nav className="bg-blue-600 p-4 text-white">
            <div className="container mx-auto flex justify-between">
              <a href="/dashboard" className="text-lg font-bold">
                Admin Panel
              </a>
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/login' });
                }}
              >
                <button type="submit">Logout</button>
              </form>
            </div>
          </nav>
        )}
        <SessionProvider session={session}>
        {children}
        </SessionProvider>
      </body>
    </html>
  );
}