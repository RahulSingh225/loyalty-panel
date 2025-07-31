
"use client";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { UserIcon, ShieldCheckIcon, ShieldExclamationIcon, XCircleIcon, QrCodeIcon, TrophyIcon, GamepadIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import pointsIcon from "../../../public/icons/points.png"
import usersIcon from "../../../public/icons/users.png";
import totalRedIcon from "../../../public/icons/totalredemption.png";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Static data from React dashboard
  const data = {
    total_users_registered: 1234,
    kyc_verified_users: 1000,
    active_users: 800,
    deactive_users: 200,
    blocked_users: 50,
    unblocked_users: 1184,
    login_approval_pending_users: 2,
    login_approved_users: 5,
    login_rejected_users: 1,
    welcome_points: 0,
    scanned_qr_code_points: 2262000,
    rewards_points: 0,
    redeemed_points: 0,
    balance_points: 0,
    number_of_qr_code_scanned: 60,
    yearly_registered_user: [],
    monthly_registered_user: [],
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const UserStatsGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-box overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="card-body relative z-10">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <ShieldCheckIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="card-title text-lg md:text-xl">{data.kyc_verified_users}</h3>
              <p className="text-sm opacity-70">KYC Verified Users</p>
              <p className="text-sm text-success">+24% From Yesterday</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-box overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="card-body relative z-10">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <XCircleIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="card-title text-lg md:text-xl">{data.deactive_users}</h3>
              <p className="text-sm opacity-70">Inactive Users</p>
              <p className="text-sm text-success">+32% From Yesterday</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-box overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="card-body relative z-10">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <UserIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="card-title text-lg md:text-xl">{data.active_users}</h3>
              <p className="text-sm opacity-70">Active Users</p>
              <p className="text-sm text-success">+20% From Yesterday</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-box overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="card-body relative z-10">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <ShieldExclamationIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="card-title text-lg md:text-xl">{data.blocked_users}</h3>
              <p className="text-sm opacity-70">Blocked Users</p>
              <p className="text-sm text-success">+22% From Yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300, 5000, 2000, 1900, 1456, 2435];
  const xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const TotalRegisteredUsers = () => (
    <div className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-box overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="card-body relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
              <Image src={usersIcon} alt="Users icon" className="h-6 w-6" width={24} height={24} />
            </div>
            <h3 className="card-title text-lg md:text-xl">Total Registered Users</h3>
          </div>
          <select className="select select-bordered select-sm">
            {["2020", "2021", "2022", "2023", "2024"].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <p className="text-sm text-success">+35% since past 5 years</p>
        <div className="mt-4">
          <h2 className="text-2xl font-bold">{data.total_users_registered}</h2>
          <p className="text-sm opacity-70">Users Registered since 2015</p>
        </div>
        <BarChart
          width={500}
          height={200}
          series={[{ data: pData, id: "pvId", color: "#008FF5" }]}
          xAxis={[{ data: xLabels, scaleType: "band" }]}
        />
      </div>
  );

  const PointsSummary = () => {
    const pieData = [
      { value: data.scanned_qr_code_points, label: "Scan", color: "#99FFFF" },
      { value: data.rewards_points, label: "Bonus", color: "#87CEEB" },
      { value: data.welcome_points, label: "Game", color: "#00CCCC" },
    ];
    const totalPoints = data.scanned_qr_code_points + data.rewards_points + data.welcome_points;

    return (
      <div className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-box overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="card-body relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
                <Image src={pointsIcon} alt="Points Icon" className="h-6 w-6" width={24} height={24} />
              </div>
              <h3 className="card-title text-lg md:text-xl">Points Summary</h3>
            </div>
            <p className="text-sm text-success">+35% points since yesterday</p>
          </div>
          <div className="flex items-center justify-between">
            <PieChart
              series={[
                {
                  data: pieData,
                  innerRadius: 80,
                  paddingAngle: 2,
                  cornerRadius: 5,
                  startAngle: -90,
                  endAngle: 270,
                },
              ]}
              width={300}
              height={200}
              slotProps={{ legend: { hidden: true } }}
            >
              <text x="35%" y="45%" textAnchor="middle" dominantBaseline="central" className="text-2xl font-bold">
                {totalPoints?.toLocaleString()}
              </text>
              <text x="35%" y="60%" textAnchor="middle" dominantBaseline="central" className="text-sm">
                Total Points
              </text>
            </PieChart>
            <div className="grid grid-cols-2 gap-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-5 h-5" style={{ backgroundColor: item.color }}></div>
                  <div>
                    <p className="text-sm">{item.label}</p>
                    <p className="font-bold">{item.value?.toLocaleString()}</p>
                    <p className="text-sm text-success">40%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    );
  };

  const TotalScans = () => (
    <div className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-box overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="card-body relative z-10">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <QrCodeIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="card-title text-lg md:text-xl">Total Number of Scans</h3>
            <p className="text-sm text-success">+35% scans done since yesterday</p>
          </div>
        </div>
        <Gauge
          sx={{
            [`& .${gaugeClasses.valueArc}`]: { fill: "#7B68EE" },
          }}
          width={300}
          height={200}
          value={data.number_of_qr_code_scanned}
          startAngle={-90}
          endAngle={90}
        >
          <text x="50%" y="55%" textAnchor="middle" dominantBaseline="central" className="text-2xl font-bold text-primary">
            {data.number_of_qr_code_scanned}
          </text>
          <text x="50%" y="65%" textAnchor="middle" dominantBaseline="central" className="text-sm">
            Scans done on {new Date().toLocaleDateString()}
          </text>
        </Gauge>
      </div>
    </div>
  );

  const TotalRedemptions = () => {
    const redemptionData = {
      approved: data.login_approved_users,
      rejected: data.login_rejected_users,
      pending: data.login_approval_pending_users,
    };

    const total = Object.values(redemptionData).reduce((sum: number, value: number) => sum + (value || 0), 0);

    return (
      <div className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-box overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="card-body relative z-10">
          <div className="flex items-center space-x-4 mb-4">
              <Image src={totalRedIcon} alt="Total Redemptions" className="h-6 w-6" width={24} height={24} />
            </div>
            <div>
              <h3 className="card-title text-lg md:text-xl">Total Redemptions</h3>
              <p className="text-sm text-success">+35% points since yesterday</p>
            </div>
          </div>
          <div className="space-y-2">
            {Object.entries(redemptionData).map(([key, value], index) => {
              const percentage = ((value || 0) / total) * 100;
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{key}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{value?.toLocaleString()}</span>
                    <span className="text-sm">({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="progress w-full max-w-xs">
                    <div
                      className={`progress-bar bg-${key === "approved" ? "success" : key === "rejected" ? "error" : "warning"}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    );
  };

  const GamesOverview = () => (
    <div className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-box overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="card-body relative z-10">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <TrophyIcon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="card-title text-lg md:text-xl">Games Overview</h3>
        </div>
        <p className="text-sm opacity-70 mb-4">Total Users that play games: 0</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <GamepadIcon className="h-5 w-5 text-primary" />
            <div>
              <p className="font-bold">2</p>
              <p className="text-sm opacity-70">Total Games</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-success" />
            <div>
              <p className="font-bold">2</p>
              <p className="text-sm opacity-70">Active Games</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <XMarkIcon className="h-5 w-5 text-error" />
            <div>
              <p className="font-bold">0</p>
              <p className="text-sm opacity-70">Inactive</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 animate-gradient-x p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Header */}
        <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-box shadow-2xl mb-12 overflow-hidden relative">
          <div className="hero-overlay bg-opacity-20"></div>
          <div className="hero-content text-center py-12">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 animate-fade-in-down">Welcome Back, Ajay Kumar!</h1>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed mb-8 animate-fade-in-up">
                Dashboard Overview - {formatDateTime(new Date())}
              </p>
              <UserStatsGrid />
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-base-content">Analytics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <TotalRegisteredUsers />
            <PointsSummary />
            <TotalScans />
            <TotalRedemptions />
            <GamesOverview />
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