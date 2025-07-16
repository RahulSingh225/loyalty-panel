'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { showErrorToast } from "@/components/toastProvider";
import { handleError } from "@/utils/errorHandler";
import { useParams } from 'next/navigation';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';


export default function ReportPage() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        if (!session) {
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
  }, [params.type, session]);

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-300 text-error text-lg">Error: {error}</div>;
  }

  // Pagination logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate truncated page buttons
  const getPageNumbers = () => {
    const maxButtons = 5; // Show up to 5 page buttons (adjustable)
    const buttons = [];
    const sideButtons = Math.floor((maxButtons - 3) / 2); // Buttons on each side of current page

    let startPage = Math.max(2, currentPage - sideButtons);
    let endPage = Math.min(totalPages - 1, currentPage + sideButtons);

    // Adjust start and end to ensure maxButtons are shown if possible
    if (endPage - startPage < maxButtons - 2) {
      if (currentPage < totalPages / 2) {
        endPage = Math.min(totalPages - 1, startPage + maxButtons - 2);
      } else {
        startPage = Math.max(2, endPage - (maxButtons - 2));
      }
    }

    // Always show first page
    buttons.push(1);

    // Add ellipsis if there's a gap after the first page
    if (startPage > 2) {
      buttons.push('...');
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }

    // Add ellipsis if there's a gap before the last page
    if (endPage < totalPages - 1) {
      buttons.push('...');
    }

    // Always show last page if totalPages > 1
    if (totalPages > 1) {
      buttons.push(totalPages);
    }

    return buttons;
  };

  return (
    <>
      <style jsx>{`
        @keyframes shine {
          0% {
            background-position: 0;
          }
          60% {
            background-position: 180px;
          }
          100% {
            background-position: 180px;
          }
        }
        .btn-shine {
          position: relative;
          display: inline-block;
          padding: 8px 16px;
          color: #fff;
          background: linear-gradient(to right, #9f9f9f 0%, #ffffff 10%, #868686 20%);
          background-position: 0;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 3s infinite linear;
          animation-fill-mode: forwards;
          -webkit-text-size-adjust: none;
          font-weight: 600;
          font-size: 1.875rem;
          text-decoration: none;
          white-space: nowrap;
          font-family: "Poppins", system-ui, -apple-system, sans-serif;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 animate-gradient-x p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="card bg-base-200 shadow-2xl rounded-box mb-12">
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold capitalize animate-fade-in-down">
                  {params.type} Report
                </h1>
                {/* Export button commented out as per provided code */}
                {/* <button
                  onClick={handleExport}
                  className="btn btn-primary btn-sm rounded-btn bg-gradient-to-r from-primary to-secondary text-primary-content border-none hover:from-primary-focus hover:to-secondary-focus hover:scale-110 transition-all duration-300"
                >
                  Export Report
                </button> */}
              </div>
              <div className="divider before:bg-primary after:bg-secondary"></div>
              <div className="overflow-x-auto">
                <table className="table w-full bg-base-100 rounded-box shadow-lg">
                  <thead>
                    <tr className="text-base-content bg-base-200">
                      <th className="text-sm md:text-base">ID</th>
                      <th className="text-sm md:text-base">Username</th>
                      {params.type === "login" && <th className="text-sm md:text-base">Login Time</th>}
                      {params.type === "enrollment" && (
                        <>
                          <th className="text-sm md:text-base">Mobile Number</th>
                          <th className="text-sm md:text-base">Enrolled At</th>
                        </>
                      )}
                      {params.type === "point-transfer" && (
                        <>
                          <th className="text-sm md:text-base">Points</th>
                          <th className="text-sm md:text-base">Transfer Date</th>
                        </>
                      )}
                      {params.type === "claim" && (
                        <>
                          <th className="text-sm md:text-base">Status</th>
                          <th className="text-sm md:text-base">Claim Date</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:scale-[1.02] transition-all duration-300"
                      >
                        <td className="text-sm md:text-base">{item.id}</td>
                        <td className="text-sm md:text-base">{item.username}</td>
                        {params.type === "login" && <td className="text-sm md:text-base">{item.loginTime}</td>}
                        {params.type === "enrollment" && (
                          <>
                            <td className="text-sm md:text-base">{item.mobileNumber}</td>
                            <td className="text-sm md:text-base">{ item.enrolledAt}</td>
                          </>
                        )}
                        {params.type === "point-transfer" && (
                          <>
                            <td className="text-sm md:text-base">{item.status}</td>
                            <td className="text-sm md:text-base">{item.transferDate}</td>
                          </>
                        )}
                        {params.type === "claim" && (
                          <>
                            <td className="text-sm md:text-base">{item.status}</td>
                            <td className="text-sm md:text-base">{item.claimDate}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                  <div className="text-sm text-base-content opacity-70">
                    Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="btn btn-sm btn-primary bg-gradient-to-r from-primary to-secondary text-primary-content border-none hover:from-primary-focus hover:to-secondary-focus hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      Previous
                    </button>
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' && handlePageChange(page)}
                        className={`btn btn-sm ${
                          page === currentPage
                            ? 'btn-active bg-primary text-primary-content'
                            : typeof page === 'number'
                            ? 'bg-base-100 text-base-content hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20'
                            : 'btn-disabled text-base-content/50'
                        } border-none transition-all duration-300 min-w-[2.5rem]`}
                        disabled={typeof page !== 'number'}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="btn btn-sm btn-primary bg-gradient-to-r from-primary to-secondary text-primary-content border-none hover:from-primary-focus hover:to-secondary-focus hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
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
    </>
  );
}