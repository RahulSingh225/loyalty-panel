import "./globals.css";
import { Inter } from "next/font/google";
import { auth, signOut } from "../auth"; // Ensure correct import
import { ToastProvider } from "@/components/toastProvider";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Panel",
  description: "Admin panel with reports",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log(auth);
  const session = await auth(); // Ensure auth is called correctly

  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <ThemeProvider>
          <ToastProvider />
            {session?.user && (
            <div className="navbar bg-base-100 shadow-md">
              <div className="flex-1">
              <a href="/dashboard" className="btn btn-ghost normal-case text-xl">
                <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0v6m0 0H7m6 0h6" />
                </svg>
                </span>
                Admin Panel
              </a>
              </div>
              <div className="flex-none gap-2">
              <ThemeSwitcher />
              <form
                action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
                }}
              >
                <button type="submit" className="btn btn-outline btn-error">
                Logout
                </button>
              </form>
              </div>
            </div>
            )}
          <SessionProvider session={session}>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
