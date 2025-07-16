import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user ) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 animate-gradient-x p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Header */}
        <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-box shadow-2xl mb-12 overflow-hidden relative">
          <div className="hero-overlay bg-opacity-20"></div>
          <div className="hero-content text-center py-12">
            <div className="max-w-xl">
              <h1 className=" text-4xl md:text-5xl font-bold tracking-tight mb-6 animate-fade-in-down">Welcome to Talkk Loyalty!</h1>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed mb-8 animate-fade-in-up">
                Streamline your loyalty program with intuitive admin tools and in-depth analytics.
              </p>
              <div className="stats stats-horizontal bg-base-100 text-base-content shadow rounded-box">
                <div className="stat px-4 py-3 md:px-6 md:py-4 hover:bg-base-200 transition-colors duration-300">
                  <div className="stat-title text-sm md:text-base">Total Members</div>
                  <div className="stat-value text-xl md:text-2xl">1,234</div>
                </div>
                <div className="stat px-4 py-3 md:px-6 md:py-4 hover:bg-base-200 transition-colors duration-300">
                  <div className="stat-title text-sm md:text-base">Active Sessions</div>
                  <div className="stat-value text-xl md:text-2xl">89</div>
                </div>
                <div className="stat px-4 py-3 md:px-6 md:py-4 hover:bg-base-200 transition-colors duration-300">
                  <div className="stat-title text-sm md:text-base">Reports</div>
                  <div className="stat-value text-xl md:text-2xl">4</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-base-content">Reports & Analytics</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-box overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="card-body relative z-10">
                <h3 className="card-title text-lg md:text-xl">Login Report</h3>
                <p className="text-sm opacity-70 mt-1">View member login history and activity logs</p>
                <div className="card-actions justify-end mt-4">
                  <Link
                    href="/reports/login"
                    className="button"
                  >
                    View Report
                  </Link>
                </div>
              </div>
            </div>
            <div className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-box overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="card-body relative z-10">
                <h3 className="card-title text-lg md:text-xl">Enrollment Report</h3>
                <p className="text-sm opacity-70 mt-1">Explore member enrollment details and statistics</p>
                <div className="card-actions justify-end mt-4">
                  <Link
                    href="/reports/enrollment"
                    className="btn btn-primary btn-sm rounded-btn bg-gradient-to-r from-primary to-secondary text-primary-content border-none hover:from-primary-focus hover:to-secondary-focus hover:scale-110 transition-all duration-300"
                  >
                    View Report
                  </Link>
                </div>
              </div>
            </div>
            <div className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-box overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="card-body relative z-10">
                <h3 className="card-title text-lg md:text-xl">Point Transfer Report</h3>
                <p className="text-sm opacity-70 mt-1">Track point transfer history across members</p>
                <div className="card-actions justify-end mt-4">
                  <Link
                    href="/reports/point-transfer"
                    className="btn btn-primary btn-sm rounded-btn bg-gradient-to-r from-primary to-secondary text-primary-content border-none hover:from-primary-focus hover:to-secondary-focus hover:scale-110 transition-all duration-300"
                  >
                    View Report
                  </Link>
                </div>
              </div>
            </div>
            <div className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-box overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="card-body relative z-10">
                <h3 className="card-title text-lg md:text-xl">Claim Report</h3>
                <p className="text-sm opacity-70 mt-1">Review claim details and statuses</p>
                <div className="card-actions justify-end mt-4">
                  <Link
                    href="/reports/claim"
                    className="btn btn-primary btn-sm rounded-btn bg-gradient-to-r from-primary to-secondary text-primary-content border-none hover:from-primary-focus hover:to-secondary-focus hover:scale-110 transition-all duration-300"
                  >
                    View Report
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider before:bg-primary after:bg-secondary"></div>

        {/* Content Management Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-base-content">Content Management</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-box overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="card-body relative z-10">
                <h3 className="card-title text-lg md:text-xl">Manage Content</h3>
                <p className="text-sm opacity-70 mt-1">Update website content and promotional materials</p>
                <div className="card-actions justify-end mt-4">
                  <Link
                    href="/content/manage"
                    className="btn btn-primary btn-sm rounded-btn bg-gradient-to-r from-primary to-secondary text-primary-content border-none hover:from-primary-focus hover:to-secondary-focus hover:scale-110 transition-all duration-300"
                  >
                    Manage Content
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider before:bg-primary after:bg-secondary"></div>

        {/* Schemes Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-base-content">Loyalty Schemes</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-box overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="card-body relative z-10">
                <h3 className="card-title text-lg md:text-xl">Manage Schemes</h3>
                <p className="text-sm opacity-70 mt-1">Create and manage loyalty programs</p>
                <div className="card-actions justify-end mt-4">
                  <Link
                    href="/schemes/manage"
                    className="btn btn-primary btn-sm rounded-btn bg-gradient-to-r from-primary to-secondary text-primary-content border-none hover:from-primary-focus hover:to-secondary-focus hover:scale-110 transition-all duration-300"
                  >
                    Manage Schemes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider before:bg-primary after:bg-secondary"></div>

        {/* Communication Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-base-content">Communication</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-box overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="card-body relative z-10">
                <h3 className="card-title text-lg md:text-xl">Member Communications</h3>
                <p className="text-sm opacity-70 mt-1">Send messages and notifications to members</p>
                <div className="card-actions justify-end mt-4">
                  <Link
                    href="/communication/manage"
                    className="btn btn-primary btn-sm rounded-btn bg-gradient-to-r from-primary to-secondary text-primary-content border-none hover:from-primary-focus hover:to-secondary-focus hover:scale-110 transition-all duration-300"
                  >
                    Manage Communications
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
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