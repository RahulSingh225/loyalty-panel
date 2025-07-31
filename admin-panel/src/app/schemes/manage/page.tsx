'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { showErrorToast } from '@/components/toastProvider';
import { handleError } from '@/utils/errorHandler';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoyaltySchemesPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [deleteSchemeId, setDeleteSchemeId] = useState(null);
  const [file, setFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null); // Added for schemePreview file
  const [formData, setFormData] = useState({
    schemeName: '',
    startDate: '',
    endDate: '',
    roles: '',
    imagePdfUrl: '',
  });
  const fileInputRef = useRef(null); // Reference for imagePdfUrl file input
  const previewFileInputRef = useRef(null); // Reference for schemePreview file input
  const rowsPerPage = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        if (!session) {
          throw new Error('User session is not available.');
        }

        const res = await fetch('/api/schemes', {
          headers: {
            Authorization: `Bearer ${session.user.id}`,
          },
        });

        const result = await res.json();

        if (res.status !== 200) {
          throw new Error(result.error || 'Failed to fetch content');
        }
        setData(result);
      } catch (error) {
        const { message } = handleError(error, 'Content Management');
        setError(message);
        showErrorToast(message);
      }
    }

    if (session) {
      fetchData();
    }
  }, [session]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf')) {
      setFile(selectedFile);
      setFormData((prev) => ({ ...prev, imagePdfUrl: '' }));
    } else {
      showErrorToast('Please select an image or PDF file for Image/PDF');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePreviewFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf')) {
      setPreviewFile(selectedFile);
    } else {
      showErrorToast('Please select an image or PDF file for Scheme Preview');
      setPreviewFile(null);
      if (previewFileInputRef.current) {
        previewFileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = selectedScheme ? 'PUT' : 'POST';
      const url = selectedScheme ? `/api/schemes/${selectedScheme.schemeId}` : '/api/schemes';

      const form = new FormData();
      form.append('schemeName', formData.schemeName);
      form.append('startDate', formData.startDate);
      form.append('endDate', formData.endDate);
      form.append('roles', formData.roles);
      if (file) {
        form.append('file', file); // For schemeResourcee
      }
      if (previewFile) {
        form.append('schemePreview', previewFile); // For schemePreview
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${session.user.id}`,
        },
        body: form,
      });

      const result = await res.json();

      if (res.status !== 200 && res.status !== 201) {
        throw new Error(result.error || 'Failed to save content');
      }

      toast.success(`Content ${selectedScheme ? 'updated' : 'created'} successfully!`);
      setIsModalOpen(false);
      setFormData({
        schemeName: '',
        startDate: '',
        endDate: '',
        roles: '',
        imagePdfUrl: '',
      });
      setSelectedScheme(null);
      setFile(null);
      setPreviewFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (previewFileInputRef.current) {
        previewFileInputRef.current.value = '';
      }

      // Refresh data
      const fetchRes = await fetch('/api/schemes', {
        headers: { Authorization: `Bearer ${session.user.id}` },
      });
      const newData = await fetchRes.json();
      setData(newData);
    } catch (error) {
      const { message } = handleError(error, 'Scheme Management');
      showErrorToast(message);
    }
  };

  const handleEdit = (content) => {
    setSelectedScheme(content);
    setFormData({
      schemeName: content.schemeName || '',
      startDate: content.startDate || '',
      endDate: content.endDate || '',
      roles: content.applicableRoles || '',
      imagePdfUrl: content.schemeResourceUrl || '',
    });
    setFile(null);
    setPreviewFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (previewFileInputRef.current) {
      previewFileInputRef.current.value = '';
    }
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/schemes/${deleteSchemeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.user.id}` },
      });

      if (res.status !== 200) {
        throw new Error('Failed to delete content');
      }

      toast.success('Content deleted successfully!');
      setIsDeleteModalOpen(false);
      setDeleteSchemeId(null);

      // Refresh data
      const fetchRes = await fetch('/api/schemes', {
        headers: { Authorization: `Bearer ${session.user.id}` },
      });
      const newData = await fetchRes.json();
      setData(newData);
    } catch (error) {
      const { message } = handleError(error, 'Schemes');
      showErrorToast(message);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  // Generate truncated page buttons
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
    if (startPage > 2) buttons.push('...');
    for (let i = startPage; i <= endPage; i++) buttons.push(i);
    if (endPage < totalPages - 1) buttons.push('...');
    if (totalPages > 1) buttons.push(totalPages);

    return buttons;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-300 text-error text-lg">
        Error: {error}
      </div>
    );
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
          font-family: 'Poppins', system-ui, -apple-system, sans-serif;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 animate-gradient-x p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="card bg-base-200 shadow-2xl rounded-box mb-12">
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <h1 className="btn-shine text-2xl md:text-3xl font-bold capitalize animate-fade-in-down">
                  Loyalty Schemes
                </h1>
                <button
                  onClick={() => {
                    setSelectedScheme(null);
                    setFormData({
                      schemeName: '',
                      startDate: '',
                      endDate: '',
                      roles: '',
                      imagePdfUrl: '',
                    });
                    setFile(null);
                    setPreviewFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                    if (previewFileInputRef.current) {
                      previewFileInputRef.current.value = '';
                    }
                    setIsModalOpen(true);
                  }}
                  className="btn btn-primary btn-sm rounded-btn bg-gradient-to-r from-primary to-secondary text-primary-content border-none hover:from-primary-focus hover:to-secondary-focus hover:scale-110 transition-all duration-300"
                >
                  Add Scheme
                </button>
              </div>
              <div className="divider before:bg-primary after:bg-secondary"></div>
              <div className="overflow-x-auto">
                <table className="table w-full bg-base-100 rounded-box shadow-lg">
                  <thead>
                    <tr className="text-base-content bg-base-200">
                      <th className="text-sm md:text-base">Scheme ID</th>
                      <th className="text-sm md:text-base">Scheme Name</th>
                      <th className="text-sm md:text-base">Active</th>
                      <th className="text-sm md:text-base">Image/PDF URL</th>
                      <th className="text-sm md:text-base">Roles</th>
                      <th className="text-sm md:text-base">Start Date</th>
                      <th className="text-sm md:text-base">End Date</th>
                      <th className="text-sm md:text-base">Created At</th>
                      <th className="text-sm md:text-base">Preview</th>
                      {/* <th className="text-sm md:text-base">Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item) => (
                      <tr
                        key={item.schemeId}
                        className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:scale-[1.02] transition-all duration-300"
                      >
                        <td className="text-sm md:text-base">{item.schemeId}</td>
                        <td className="text-sm md:text-base">{item.schemeName}</td>
                        <td className="text-sm md:text-base">{item.isActive ? 'Yes' : 'No'}</td>
                        <td className="text-sm md:text-base truncate max-w-xs">
                          {item.schemeResourceUrl ? (
                            <a
                              href={item.schemeResourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link link-primary"
                            >
                              View
                            </a>
                          ) : '-'}
                        </td>
                        <td className="text-sm md:text-base">{item.applicableRoles}</td>
                        <td className="text-sm md:text-base">{item.startDate}</td>
                        <td className="text-sm md:text-base">{item.endDate}</td>
                        <td className="text-sm md:text-base">{new Date(item.lastUpdatedAt).toLocaleString()}</td>
                        <td className="text-sm md:text-base truncate max-w-xs">
                          {item.schemePreviewUrl ? (
                            <a
                              href={item.schemePreviewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link link-primary"
                            >
                              View
                            </a>
                          ) : '-'}
                        </td>
                        {/* <td className="text-sm md:text-base">
                          <button
                            onClick={() => handleEdit(item)}
                            className="btn btn-ghost btn-sm text-primary hover:bg-primary/20 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setDeleteSchemeId(item.schemeId);
                              setIsDeleteModalOpen(true);
                            }}
                            className="btn btn-ghost btn-sm text-error hover:bg-error/20"
                          >
                            Delete
                          </button>
                        </td> */}
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

          {/* Edit/Create Modal */}
          <input
            type="checkbox"
            id="content-modal"
            className="modal-toggle"
            checked={isModalOpen}
            onChange={() => setIsModalOpen(!isModalOpen)}
          />
          <div className="modal">
            <div className="modal-box bg-base-100">
              <h3 className="text-lg font-bold">{selectedScheme ? 'Edit Scheme' : 'Add Scheme'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Scheme Name */}
                <div>
                  <label className="label">
                    <span className="label-text">Scheme Name</span>
                  </label>
                  <input
                    type="text"
                    name="schemeName"
                    value={formData.schemeName}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                    maxLength={50}
                  />
                </div>
                {/* Target Audience Dropdown */}
                <div>
                  <label className="label">
                    <span className="label-text">Roles</span>
                  </label>
                  <select
                    name="roles"
                    value={formData.roles}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select</option>
                    <option value="1">Sales</option>
                    <option value="2">Distributor</option>
                    <option value="3">Retailer</option>
                  </select>
                </div>
                {/* Image/PDF URL */}
                <div>
                  <label className="label">
                    <span className="label-text">Image/PDF URL</span>
                  </label>
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </div>
                {/* Scheme Preview */}
                <div>
                  <label className="label">
                    <span className="label-text">Scheme Preview</span>
                  </label>
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    accept="image/*,application/pdf"
                    onChange={handlePreviewFileChange}
                    ref={previewFileInputRef}
                  />
                </div>
                {/* Start Date */}
                <div>
                  <label className="label">
                    <span className="label-text">Start Date</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                {/* End Date */}
                <div>
                  <label className="label">
                    <span className="label-text">End Date</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                {/* Modal Actions */}
                <div className="modal-action">
                  <button
                    type="submit"
                    className="btn btn-primary bg-gradient-to-r from-primary to-secondary text-primary-content border-none hover:from-primary-focus hover:to-secondary-focus hover:scale-110 transition-all duration-300"
                  >
                    {selectedScheme ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setFile(null);
                      setPreviewFile(null);
                      setFormData({
                        schemeName: '',
                        startDate: '',
                        endDate: '',
                        roles: '',
                        imagePdfUrl: '',
                      });
                      setSelectedScheme(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                      if (previewFileInputRef.current) {
                        previewFileInputRef.current.value = '';
                      }
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          <input
            type="checkbox"
            id="delete-modal"
            className="modal-toggle"
            checked={isDeleteModalOpen}
            onChange={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
          />
          <div className="modal">
            <div className="modal-box bg-base-100">
              <h3 className="text-lg font-bold">Confirm Deletion</h3>
              <p className="py-4">Are you sure you want to delete this content?</p>
              <div className="modal-action">
                <button
                  onClick={handleDelete}
                  className="btn btn-error bg-gradient-to-r from-error to-error/80 text-error-content border-none hover:from-error/80 hover:to-error hover:scale-110 transition-all duration-300"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
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
      </div>
    </>
  );
}