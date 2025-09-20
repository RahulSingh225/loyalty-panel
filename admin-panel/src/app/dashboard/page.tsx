// app/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import DashboardStats from "@/components/dashboardStats";

// Define API response type
interface DashboardResponse {
  total_retailers: number;
  total_distributors: number;
  total_salesperson: number;
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch dashboard data
  let stats: DashboardResponse = { total_retailers: 0, total_distributors: 0, total_salesperson: 0 };
  let error: string | undefined;

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/nextapi/dashboard`, {
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    const data: DashboardResponse = await response.json();
    stats = data;
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    error = 'Unable to load dashboard statistics. Please try again later.';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 animate-gradient-x p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Header */}
        <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-box shadow-2xl mb-12 overflow-hidden relative">
          <div className="hero-overlay bg-opacity-20"></div>
          <div className="hero-content text-center py-12">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 animate-fade-in-down">
                Welcome to Talkk Loyalty!
              </h1>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed mb-8 animate-fade-in-up">
                Streamline your loyalty program with intuitive admin tools and in-depth analytics.
              </p>
              <DashboardStats
                total_retailers={stats.total_retailers}
                total_distributors={stats.total_distributors}
                total_salesperson={stats.total_salesperson}
                error={error}
              />
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
            <div className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-box overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="card-body relative z-10">
                <h3 className="card-title text-lg md:text-xl">OTP Report</h3>
                <p className="text-sm opacity-70 mt-1">View OTP requests and validation logs</p>
                <div className="card-actions justify-end mt-4">
                  <Link
                    href="/reports/otp"
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