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
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold capitalize">{params.type} Report</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              {params.type === "login" && <th>Login Time</th>}
              {params.type === "enrollment" && (
                <>
                  <th>Course Name</th>
                  <th>Enrolled At</th>
                </>
              )}
              {params.type === "point-transfer" && (
                <>
                  <th>Points</th>
                  <th>Transfer Date</th>
                </>
              )}
              {params.type === "claim" && (
                <>
                  <th>Claim Type</th>
                  <th>Claimed At</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item: any) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.username}</td>
                {params.type === "login" && <td>{item.loginTime}</td>}
                {params.type === "enrollment" && (
                  <>
                    <td>{item.courseName}</td>
                    <td>{item.enrolledAt}</td>
                  </>
                )}
                {params.type === "point-transfer" && (
                  <>
                    <td>{item.points}</td>
                    <td>{item.transferDate}</td>
                  </>
                )}
                {params.type === "claim" && (
                  <>
                    <td>{item.claimType}</td>
                    <td>{item.claimedAt}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}