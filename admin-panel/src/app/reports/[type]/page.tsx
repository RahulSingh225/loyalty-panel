'use client';

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { showErrorToast } from "@/components/toastProvider";
import { handleError } from "@/utils/errorHandler";
import { useParams } from 'next/navigation';
export default function ReportPage() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const params = useParams();
  useEffect(() => {
    async function fetchData() {
      try {
        

        if (!session || !session.user || !session.user.id) {
          throw new Error("User session is not available.");
        }

        const res = await fetch(`/api/reports/${params.type}`, {
          headers: {
            Authorization: `Bearer ${session.user.id}`,
          },
        });

        const result = await res.json();

        if (res.status !== 200) {
          throw new Error(result.error || "Failed to fetch report");
        }

        setData(result);
      } catch (error) {
        const { message } = handleError(error, `Report ${params.type}`);
        setError(message);
        showErrorToast(message);
      }
    }

    fetchData();
  }, [params.type]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-3xl font-bold capitalize">{params.type} Report</h1>
      <table className="w-full rounded-lg bg-white shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Username</th>
            {params.type === "login" && <th className="p-4 text-left">Login Time</th>}
            {params.type === "enrollment" && (
              <>
                <th className="p-4 text-left">Course Name</th>
                <th className="p-4 text-left">Enrolled At</th>
              </>
            )}
            {params.type === "point-transfer" && (
              <>
                <th className="p-4 text-left">Points</th>
                <th className="p-4 text-left">Transfer Date</th>
              </>
            )}
            {params.type === "claim" && (
              <>
                <th className="p-4 text-left">Claim Type</th>
                <th className="p-4 text-left">Claimed At</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item: any) => (
            <tr key={item.id} className="border-b">
              <td className="p-4">{item.id}</td>
              <td className="p-4">{item.username}</td>
              {params.type === "login" && <td className="p-4">{item.loginTime}</td>}
              {params.type === "enrollment" && (
                <>
                  <td className="p-4">{item.courseName}</td>
                  <td className="p-4">{item.enrolledAt}</td>
                </>
              )}
              {params.type === "point-transfer" && (
                <>
                  <td className="p-4">{item.points}</td>
                  <td className="p-4">{item.transferDate}</td>
                </>
              )}
              {params.type === "claim" && (
                <>
                  <td className="p-4">{item.claimType}</td>
                  <td className="p-4">{item.claimedAt}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}