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
import {firebaseService} from "@/app/services/firebase.service";

export default function ReportPage() {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
    const [refNo, setRefNo] = useState<string>('');
     const [usernameFilter, setUsernameFilter] = useState<string>('');
    const [mobileFilter, setMobileFilter] = useState<string>('');
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [detailsData, setDetailsData] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [notificationModalOpen, setNotificationModalOpen] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationBody, setNotificationBody] = useState("");
    const [notificationLoading, setNotificationLoading] = useState(false);
    const [notificationTargetId, setNotificationTargetId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!session) {
          throw new Error("User session is not available.");
        }

        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        if (refNo) queryParams.append('refNo', refNo);
        if (mobileFilter) queryParams.append('mobileNumber', mobileFilter);
        if(usernameFilter) queryParams.append('username', usernameFilter);

        const res = await fetch(`/nextapi/reports/${params.type}?${queryParams.toString()}`, {
          headers: {
            Authorization: `Bearer ${session.user.id}`,
          },
        });

        const result = await res.json();

        if (res.status !== 200) {
          throw new Error(result.error || "Failed to fetch report");
        }
        console.log(result)
        setData(result);
        setFilteredData(result);
      } catch (error) {
        const { message } = handleError(error, `Report ${params.type}`);
        setError(message);
        showErrorToast(message);
      }
    }

    fetchData();
  }, [params.type, session, startDate, endDate,refNo,mobileFilter]);

  useEffect(() => {
    let filtered = data;

    if (startDate || endDate) {
      filtered = data.filter(item => {
        let itemDate;
        switch (params.type) {
          case 'login':
            itemDate = item.loginTime;
            break;
          case 'enrollment':
            itemDate = item.enrolledAt;
            break;
          case 'point-transfer':
            itemDate = item.transferDate;
            break;
          case 'claim':
            itemDate = item.claimDate;
            break;
          default:
            return true;
        }

        const date = moment(itemDate);
        const start = startDate ? moment(startDate) : null;
        const end = endDate ? moment(endDate).endOf('day') : null;

        if (start && end) {
          return date.isBetween(start, end, undefined, '[]');
        } else if (start) {
          return date.isSameOrAfter(start);
        } else if (end) {
          return date.isSameOrBefore(end);
        }
        return true;
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, startDate, endDate, params.type]);


  async function sendNotification() { 
 try {

  const body = {
    payload:{ title: notificationTitle, body: notificationBody },
    target: { type: "single", token: notificationTargetId }

  }
                  const res =   await fetch('/nextapi/communication/single', {
                    method:'POST',
                    headers: {
                      Authorization: `Bearer ${session.user.id}`,
                    
                    },
                    body:JSON.stringify(body),  
 })
                      
                      // Optionally show success toast
                    } catch (e) {
                      const { message } = handleError(error, `Report ${params.type}`);
        setError(message);
        showErrorToast(message);
                    }

  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const maxButtons = 5;
    const buttons = [];
    const sideButtons = Math.floor((maxButtons - 3) / 2);

    let startPage = Math.max(2, currentPage - sideButtons);
    let endPage = Math.min(totalPages - 1, currentPage + sideButtons);

    if (endPage - startPage < maxButtons - 2) {
      if (currentPage < totalPages / 2) {
        endPage = Math.min(totalPages - 1, startPage + maxButtons - 2);
      } else {
        startPage = Math.max(2, endPage - (maxButtons - 2));
      }
    }

    buttons.push(1);
    if (startPage > 2) {
      buttons.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }

    if (endPage < totalPages - 1) {
      buttons.push('...');
    }

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
      <div className="min-h-screen bg-base-100 p-4 md:p-6 lg:p-8">
        <div className=" mx-auto">
          <div className="flex card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <h1 className="card-title text-2xl md:text-3xl capitalize btn-shine">
                  {params.type} Report
                </h1>
              </div>
            
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {(params.type === "agents" || params.type === "salesperson" || params.type === "retailers") ? (
                  <>
                   <div className="form-control flex-1">
                      <label className="label">
                        <span className="label-text">Username</span>
                      </label>
                      <input
                        type="text"
                        value={usernameFilter}
                        onChange={(e) => setUsernameFilter(e.target.value)}
                        className="input input-bordered w-full"
                        placeholder="Enter Username"
                      />
                    </div>
                    <div className="form-control flex-1">
                      <label className="label">
                        <span className="label-text">Ref No</span>
                      </label>
                      <input
                        type="text"
                        value={refNo}
                        onChange={(e) => setRefNo(e.target.value)}
                        className="input input-bordered w-full"
                        placeholder="Enter Ref No"
                      />
                    </div>
                    <div className="form-control flex-1">
                      <label className="label">
                        <span className="label-text">Mobile Number</span>
                      </label>
                      <input
                        type="text"
                        value={mobileFilter}
                        onChange={(e) => setMobileFilter(e.target.value)}
                        className="input input-bordered w-full"
                        placeholder="Enter Mobile Number"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-control flex-1">
                      <label className="label">
                        <span className="label-text">Start Date</span>
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div className="form-control flex-1">
                      <label className="label">
                        <span className="label-text">End Date</span>
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="input input-bordered w-full"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="divider"></div>
              <div className="overflow-x-auto">
                <table className="table w-[80vw] max-w-[80vw] mx-auto">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                        {params.type === "login" && (
                          <>
                            <th>User Type</th>
                            <th>Login Time</th>
                          </>
                        )}
                        {params.type === "enrollment" && (
                          <>
                            <th>Mobile Number</th>
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
                            <th>Status</th>
                            <th>Claim Date</th>
                          </>
                        )}
                        {params.type === "otp" && (
                          <>
                            <th>Mobile Number</th>
                            <th>OTP</th>
                            <th>Status</th>
                            <th>Created At</th>
                          </>
                        )}
                        {(params.type === "retailers" || params.type === "agents" || params.type === "salesperson") && (
                          <>
                            <th>Mobile Number</th>
                            <th>Created At</th>
                            {paginatedData.length > 0 && Object.keys(paginatedData[0]).filter(key => !['username','mobileNumber','createdAt'].includes(key)).map(key => (
                              <th key={key}>{key}</th>
                            ))}
                            <th>Actions</th>
                          </>
                        )}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.username}</td>
                          {params.type === "login" && (
                            <>
                              <td>{item.userType}</td>
                              <td>{item.loginTime}</td>
                            </>
                          )}
                          {params.type === "enrollment" && (
                            <>
                              <td>{item.mobileNumber}</td>
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
                              <td>{item.status}</td>
                              <td>{item.claimDate}</td>
                            </>
                          )}
                          {params.type === "otp" && (
                            <>
                              <td>{item.mobileNumber}</td>
                              <td>{item.otpCode}</td>
                              <td>{item.status}</td>
                              <td>{item.createdAt}</td>
                            </>
                          )}
                          {(params.type === "retailers" || params.type === "agents" || params.type === "salesperson") && (
                            <>
                              <td>{item.mobileNumber}</td>
                              <td>{item.createdAt}</td>
                              {Object.keys(item).filter(key => !['username','mobileNumber','createdAt'].includes(key)).map(key => (
                                <td key={key}>{String(item[key])}</td>
                              ))}
                              <td>
                                <div className="flex gap-2">
                                  <button
                                    className="btn btn-primary btn-xs"
                                    onClick={async () => {
                                      console.log('View Details clicked for', item);
                                      if (params.type === "retailers" && item.refno) {
                                        setDetailsLoading(true);
                                        setDetailsModalOpen(true);
                                        try {
                                          const res = await fetch(`/nextapi/retailer/${item.refno}`);
                                          const result = await res.json();
                                          setDetailsData(result);
                                        } catch (e) {
                                          setDetailsData({ error: 'Failed to fetch details' });
                                        }
                                        setDetailsLoading(false);
                                      }
                                      // TODO: Add similar logic for agents/salesperson if needed
                                    }}
                                  >
                                    View Details
                                  </button>
                                  <button
                                    className="btn btn-secondary btn-xs"
                                    onClick={() => {
                                      setNotificationTargetId(item.fcmToken);
                                      setNotificationModalOpen(true);
                                    }}
                                  >
                                    Send Notification
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                  <div className="text-sm">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
                  </div>
                  <div className="join">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="join-item btn btn-sm"
                    >
                      Previous
                    </button>
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' && handlePageChange(page)}
                        className={`join-item btn btn-sm ${page === currentPage ? 'btn-active' : ''}`}
                        disabled={typeof page !== 'number'}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="join-item btn btn-sm"
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

        {/* Retailer Details Modal */}
        {detailsModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg mb-4">Retailer Details</h3>
              {detailsLoading ? (
                <span className="loading loading-spinner loading-lg"></span>
              ) : detailsData && !detailsData.error ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Detail label="Retailer ID" value={detailsData.retailerId} />
                    <Detail label="User ID" value={detailsData.userId} />
                    <Detail label="Distributor ID" value={detailsData.distributorId} />
                    <Detail label="Shop Name" value={detailsData.shopName} />
                    <Detail label="Shop Address" value={detailsData.shopAddress} />
                    <Detail label="Pin Code" value={detailsData.pinCode} />
                    <Detail label="City" value={detailsData.city} />
                    <Detail label="State" value={detailsData.state} />
                    <Detail label="Whatsapp No" value={detailsData.whatsappNo} />
                    <Detail label="PAN No" value={detailsData.panNo} />
                    <Detail label="GST Registration No" value={detailsData.gstRegistrationNo} />
                    <Detail label="Aadhaar Card No" value={detailsData.aadhaarCardNo} />
                    <Detail label="Navision ID" value={detailsData.navisionId} />
                    <Detail label="Home Address" value={detailsData.homeAddress} />
                  <Detail label="Beat Name" value={detailsData.beatName} />
                  <Detail label="Sales Agent Code" value={detailsData.salesAgentCodee} />

                    <Detail label="Created At" value={detailsData.createdAt} />
                  </div>
                  <div className="modal-action">
                    <button className="btn btn-primary" onClick={() => setDetailsModalOpen(false)}>
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <div>No details available.</div>
              )}
                </div>
          </div>
      )}

        {/* Send Notification Dialog */}
        {notificationModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box max-w-md">
              <h3 className="font-bold text-lg mb-4">Send Notification</h3>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={notificationTitle}
                  onChange={e => setNotificationTitle(e.target.value)}
                  placeholder="Enter notification title"
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Body</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={notificationBody}
                  onChange={e => setNotificationBody(e.target.value)}
                  placeholder="Enter notification body"
                />
              </div>
              <div className="modal-action">
                <button
                  className="btn btn-primary"
                  disabled={notificationLoading}
                  onClick={async () => {
                    console.log('Notification Target ID:', notificationTargetId);
                    setNotificationLoading(true);
                    
                    await sendNotification();
                   
                    setNotificationLoading(false);
                    setNotificationModalOpen(false);
                    setNotificationTitle("");
                    setNotificationBody("");
                  }}
                >
                  Send
                </button>
                <button className="btn btn-ghost" onClick={() => setNotificationModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="font-semibold text-base-content/80">{label}</span>
      <span className="text-base-content/60 break-all">{value ?? '-'}</span>
    </div>
  );
}