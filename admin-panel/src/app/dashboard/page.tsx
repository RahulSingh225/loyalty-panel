import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href="/reports/login"
          className="rounded-lg bg-white p-6 shadow-md hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">Login Report</h2>
          <p className="text-gray-600">View user login history</p>
        </Link>
        <Link
          href="/reports/enrollment"
          className="rounded-lg bg-white p-6 shadow-md hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">Enrollment Report</h2>
          <p className="text-gray-600">View course enrollment details</p>
        </Link>
        <Link
          href="/reports/point-transfer"
          className="rounded-lg bg-white p-6 shadow-md hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">Point Transfer Report</h2>
          <p className="text-gray-600">View point transfer history</p>
        </Link>
        <Link
          href="/reports/claim"
          className="rounded-lg bg-white p-6 shadow-md hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">Claim Report</h2>
          <p className="text-gray-600">View claim details</p>
        </Link>
      </div>
    </div>
  );
}