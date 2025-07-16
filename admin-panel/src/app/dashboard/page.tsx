import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { DashboardCard } from "@/components/dashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="navbar bg-primary text-primary-content shadow-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"></path>
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/users">Users</Link></li>
              <li><Link href="/settings">Settings</Link></li>
            </ul>
          </div>
          <Link href="/dashboard" className="btn btn-ghost text-xl">
            Admin Portal
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link href="/dashboard" className="active">Dashboard</Link></li>
            <li><Link href="/users">Users</Link></li>
            <li><Link href="/settings">Settings</Link></li>
          </ul>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <div className="bg-primary-content text-primary rounded-full w-full h-full flex items-center justify-center font-bold">
                  {session.user.name?.[0] || session.user.email?.[0] || 'A'}
                </div>
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <div className="justify-between">
                  {session.user.name || session.user.email}
                  <span className="badge badge-primary badge-sm">Admin</span>
                </div>
              </li>
              <li><Link href="/profile">Profile</Link></li>
              <li><Link href="/logout">Logout</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6 lg:p-8">
        {/* Welcome Section */}
        <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg shadow-lg mb-8">
          <div className="hero-content text-center py-12">
            <div className="max-w-md">
              <h1 className="mb-5 text-4xl font-bold">Welcome Back!</h1>
              <p className="mb-5 text-lg opacity-90">
                Manage your application with powerful admin tools and comprehensive reports.
              </p>
              <div className="stats stats-horizontal shadow bg-base-100 text-base-content">
                <div className="stat">
                  <div className="stat-title text-sm">Total Users</div>
                  <div className="stat-value text-lg">1,234</div>
                </div>
                <div className="stat">
                  <div className="stat-title text-sm">Active Sessions</div>
                  <div className="stat-value text-lg">89</div>
                </div>
                <div className="stat">
                  <div className="stat-title text-sm">Reports</div>
                  <div className="stat-value text-lg">4</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-base-content">Reports & Analytics</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="card-title text-lg">Login Report</h3>
                    <p className="text-sm opacity-70">View user login history and activity logs</p>
                  </div>
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full bg-success text-success-content flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="card-actions justify-end">
                  <Link href="/reports/login" className="btn btn-primary btn-sm">
                    View Report
                  </Link>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="card-title text-lg">Enrollment Report</h3>
                    <p className="text-sm opacity-70">Explore course enrollment details and statistics</p>
                  </div>
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full bg-warning text-warning-content flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="card-actions justify-end">
                  <Link href="/reports/enrollment" className="btn btn-primary btn-sm">
                    View Report
                  </Link>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="card-title text-lg">Point Transfer Report</h3>
                    <p className="text-sm opacity-70">Track point transfer history across users</p>
                  </div>
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full bg-info text-info-content flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="card-actions justify-end">
                  <Link href="/reports/point-transfer" className="btn btn-primary btn-sm">
                    View Report
                  </Link>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="card-title text-lg">Claim Report</h3>
                    <p className="text-sm opacity-70">Review claim details and statuses</p>
                  </div>
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full bg-error text-error-content flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="card-actions justify-end">
                  <Link href="/reports/claim" className="btn btn-primary btn-sm">
                    View Report
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-base-content">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/users/create" className="btn btn-outline btn-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add New User
            </Link>
            <Link href="/reports/export" className="btn btn-outline btn-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Export Data
            </Link>
            <Link href="/settings/system" className="btn btn-outline btn-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              System Settings
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                <div className="avatar">
                  <div className="w-8 h-8 rounded-full bg-success text-success-content flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs opacity-70">john.doe@example.com - 2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                <div className="avatar">
                  <div className="w-8 h-8 rounded-full bg-warning text-warning-content flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System backup completed</p>
                  <p className="text-xs opacity-70">Database backup - 15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                <div className="avatar">
                  <div className="w-8 h-8 rounded-full bg-info text-info-content flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Report generated</p>
                  <p className="text-xs opacity-70">Monthly enrollment report - 1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}