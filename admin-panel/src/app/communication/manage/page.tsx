'use client'

import { useSession } from "next-auth/react";
import { useState } from "react";
import { showErrorToast } from "@/components/toastProvider";
import { handleError } from "@/utils/errorHandler";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { redirect } from "next/navigation";

export default function CommunicationsPage() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    imageUrl: '',
    dataKey: '',
    dataValue: '',
    androidPriority: 'high' as 'normal' | 'high',
    androidTtl: '3600',
    androidChannelId: 'default_channel_id',
    targetType: 'single' as 'single' | 'selected' | 'all'
    
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!session) {
        throw new Error("User session is not available.");
      }

      // Construct payload and target
      const payload: any = {
        title: formData.title,
        body: formData.body,
        imageUrl: formData.imageUrl || undefined,
        data: formData.dataKey && formData.dataValue ? { [formData.dataKey]: formData.dataValue } : undefined,
        android: {
          priority: formData.androidPriority,
          ttl: parseInt(formData.androidTtl) || 3600,
          channelId: formData.androidChannelId,
        }
        
      };

      const target: any = {
        type: formData.targetType,
      };

      // Send notification via API
      const res = await fetch('/nextapi/communication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.id}`,
        },
        body: JSON.stringify({ payload, target }),
      });

      const result = await res.json();

      if (res.status !== 200) {
        throw new Error(result.error || "Failed to send notification");
      }

      toast.success("Notification sent successfully!");
      setIsModalOpen(false);
      setFormData({
        title: '',
        body: '',
        imageUrl: '',
        dataKey: '',
        dataValue: '',
        androidPriority: 'high',
        androidTtl: '3600',
        androidChannelId: 'default_channel_id',
        targetType: 'single',
        
      });
    } catch (error) {
      const { message } = handleError(error, "Communication");
      showErrorToast(message);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-300">Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/nextapi/auth/signin");
  }

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
                <h1 className="btn-shine text-2xl md:text-3xl font-bold capitalize animate-fade-in-down">
                  Send Notification
                </h1>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-primary btn-sm rounded-btn bg-gradient-to-r from-primary to-secondary text-primary-content border-none hover:from-primary-focus hover:to-secondary-focus hover:scale-110 transition-all duration-300"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Send Notification Modal */}
          <input type="checkbox" id="content-modal" className="modal-toggle" checked={isModalOpen} onChange={() => setIsModalOpen(!isModalOpen)} />
          <div className="modal">
            <div className="modal-box bg-base-100 max-w-2xl">
              <h3 className="text-lg font-bold">Send Notification</h3>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Body</span>
                  </label>
                  <textarea
                    name="body"
                    value={formData.body}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered w-full"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Image URL (optional)</span>
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Data Key (optional)</span>
                  </label>
                  <input
                    type="text"
                    name="dataKey"
                    value={formData.dataKey}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    maxLength={50}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Data Value (optional)</span>
                  </label>
                  <input
                    type="text"
                    name="dataValue"
                    value={formData.dataValue}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Android Priority</span>
                  </label>
                  <select
                    name="androidPriority"
                    value={formData.androidPriority}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Android TTL (seconds)</span>
                  </label>
                  <input
                    type="number"
                    name="androidTtl"
                    value={formData.androidTtl}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Android Channel ID</span>
                  </label>
                  <input
                    type="text"
                    name="androidChannelId"
                    value={formData.androidChannelId}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    maxLength={50}
                  />
                </div>
               
                <div>
                  <label className="label">
                    <span className="label-text">Target Type</span>
                  </label>
                  <select
                    name="targetType"
                    value={formData.targetType}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    
                    <option value="all">All Users</option>
                    <option value="retailer">All Retailers</option>
                    <option value="distributor">All Agents</option>
                    <option value="sales">All Sales</option>
                  </select>
                </div>
                
                <div className="modal-action">
                  <button
                    type="submit"
                    className="btn btn-primary bg-gradient-to-r from-primary to-secondary text-primary-content border-none hover:from-primary-focus hover:to-secondary-focus hover:scale-110 transition-all duration-300"
                  >
                    Send
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </form>
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
      </div>
    </>
  );
}