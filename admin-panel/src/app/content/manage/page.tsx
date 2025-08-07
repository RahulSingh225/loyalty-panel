'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { showErrorToast } from "@/components/toastProvider";
import { handleError } from "@/utils/errorHandler";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ContentManagementPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [deleteContentId, setDeleteContentId] = useState(null);
  const [formData, setFormData] = useState({
    contentType: '',
    content: '',
    imagePdfUrl: '',
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [previewFile, setPreviewFile] = useState(null); // New state for preview image
  const [previewFileUrl, setPreviewFileUrl] = useState(null); // New state for preview image URL
  const rowsPerPage = 10;
  const contentTypes = [
    { label: 'PRODUCT_CATALOG', value: 'PRODUCT_CATALOG' },
    { label: 'BANNER', value: 'BANNER' }
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        if (!session) {
          throw new Error("User session is not available.");
        }

        const res = await fetch('/api/content-management', {
          headers: {
            Authorization: `Bearer ${session.user.id}`,
          },
        });

        const result = await res.json();

        if (res.status !== 200) {
          throw new Error(result.error || "Failed to fetch content");
        }

        setData(result);
      } catch (error) {
        const { message } = handleError(error, "Content Management");
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
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
    } else {
      showErrorToast('Please select an image or PDF file');
      setFile(null);
      setFilePreview(null);
    }
  };

  const handlePreviewFileChange = (e) => {
    const selectedPreviewFile = e.target.files?.[0];
    if (selectedPreviewFile && selectedPreviewFile.type.match(/\.(jpeg|jpg|png)$/i)) {
      setPreviewFile(selectedPreviewFile);
      const previewUrl = URL.createObjectURL(selectedPreviewFile);
      setPreviewFileUrl(previewUrl);
    } else {
      showErrorToast('Please select a JPG or PNG file for preview');
      setPreviewFile(null);
      setPreviewFileUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = selectedContent ? 'PUT' : 'POST';
      const url = selectedContent
        ? `/api/content-management/${selectedContent.contentId}`
        : '/api/content-management';

      const formDataToSend = new FormData();
      formDataToSend.append('contentType', formData.contentType);
      formDataToSend.append('content', formData.content);
      if (file) {
        formDataToSend.append('file', file);
      } else if (formData.imagePdfUrl) {
        formDataToSend.append('imagePdfUrl', formData.imagePdfUrl);
      }
      if (previewFile) {
        formDataToSend.append('preview', previewFile);
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${session.user.id}`,
        },
        body: formDataToSend,
      });

      const result = await res.json();

      if (res.status !== 200 && res.status !== 201) {
        throw new Error(result.error || "Failed to save content");
      }

      toast.success(`Content ${selectedContent ? 'updated' : 'created'} successfully!`);
      setIsModalOpen(false);
      setFormData({ contentType: '', content: '', imagePdfUrl: '' });
      setFile(null);
      setFilePreview(null);
      setPreviewFile(null);
      setPreviewFileUrl(null);

      // Refresh data
      const fetchRes = await fetch('/api/content-management', {
        headers: { Authorization: `Bearer ${session.user.id}` },
      });
      const newData = await fetchRes.json();
      setData(newData);
    } catch (error) {
      const { message } = handleError(error, "Content Management");
      showErrorToast(message);
    }
  };

  const handleEdit = (content) => {
    setSelectedContent(content);
    setFormData({
      contentType: content.contentType,
      content: content.content || '',
      imagePdfUrl: content.imagePdfUrl || '',
    });
    setFile(null);
    setFilePreview(content.imagePdfUrl || null);
    setPreviewFile(null);
    setPreviewFileUrl(content.previewImageUrl || null); // Assuming previewImageUrl from API
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/content-management/${deleteContentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.user.id}` },
      });

      if (res.status !== 200) {
        throw new Error("Failed to delete content");
      }

      toast.success("Content deleted successfully!");
      setIsDeleteModalOpen(false);
      setDeleteContentId(null);

      // Refresh data
      const fetchRes = await fetch('/api/content-management', {
        headers: { Authorization: `Bearer ${session.user.id}` },
      });
      const newData = await fetchRes.json();
      setData(newData);
    } catch (error) {
      const { message } = handleError(error, "Content Management");
      showErrorToast(message);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
      if (previewFileUrl) {
        URL.revokeObjectURL(previewFileUrl);
      }
    };
  }, [filePreview, previewFileUrl]);

  // Pagination logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

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
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-300 text-error text-lg">Error: {error}</div>;
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
                  Content Management
                </h1>
                <button
                  onClick={() => {
                    setSelectedContent(null);
                    setFormData({ contentType: '', content: '', imagePdfUrl: '' });
                    setFile(null);
                    setFilePreview(null);
                    setPreviewFile(null);
                    setPreviewFileUrl(null);
                    setIsModalOpen(true);
                  }}
                  className="btn btn-primary btn-sm rounded-btn bg-gradient-to-r from-primary to-secondary text-primary-content border-none hover:from-primary-focus hover:to-secondary-focus hover:scale-110 transition-all duration-300"
                >
                  Add Content
                </button>
              </div>
              <div className="divider before:bg-primary after:bg-secondary"></div>
              <div className="overflow-x-auto">
                <table className="table w-full bg-base-100 rounded-box shadow-lg">
                  <thead>
                    <tr className="text-base-content bg-base-200">
                      <th className="text-sm md:text-base">ID</th>
                      <th className="text-sm md:text-base">Content Type</th>
                      <th className="text-sm md:text-base">Content</th>
                      <th className="text-sm md:text-base">Image/PDF URL</th>
                      <th className="text-sm md:text-base">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item) => (
                      <tr
                        key={item.contentId}
                        className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:scale-[1.02] transition-all duration-300"
                      >
                        <td className="text-sm md:text-base">{item.contentId}</td>
                        <td className="text-sm md:text-base">{item.contentType}</td>
                        <td className="text-sm md:text-base truncate max-w-xs">{item.content || '-'}</td>
                        <td className="text-sm md:text-base truncate max-w-xs">
                          {item.contentResourceUrl ? (
                            <a href={item.contentResourceUrl} target="_blank" rel="noopener noreferrer" className="link link-primary">
                              View
                            </a>
                          ) : '-'}
                        </td>
                        <td className="text-sm md:text-base">{new Date(item.lastUpdatedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                        className={`btn btn-sm ${page === currentPage
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

          <input type="checkbox" id="content-modal" className="modal-toggle" checked={isModalOpen} onChange={() => setIsModalOpen(!isModalOpen)} />
          <div className="modal">
            <div className="modal-box bg-base-100">
              <h3 className="text-lg font-bold">{selectedContent ? 'Edit Content' : 'Add Content'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="label">
                    <span className="label-text">Content Name</span>
                  </label>
                  <input
                    type="text"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                    maxLength={50}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Content Type</span>
                  </label>
                  <select
                    name="contentType"
                    className="select select-bordered w-full"
                    value={formData.contentType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select content type</option>
                    {contentTypes.map((type) => (
                      <option key={type.label} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Image/PDF</span>
                  </label>
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                  />
                  {file && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {file.name}
                    </p>
                  )}
                  {formData.imagePdfUrl && !file && (
                    <p className="mt-2 text-sm text-gray-600">
                      Current URL: <a href={formData.imagePdfUrl} target="_blank" rel="noopener noreferrer" className="link link-primary">View</a>
                    </p>
                  )}
                </div>
                {(filePreview || (formData.imagePdfUrl && !file)) && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Main File Preview</span>
                    </label>
                    <div className="border rounded-lg p-2 bg-base-200 max-h-64 overflow-auto">
                      {filePreview && file?.type.startsWith('image/') && (
                        <img
                          src={filePreview}
                          alt="Main File Preview"
                          className="max-w-full h-auto max-h-48 object-contain"
                        />
                      )}
                      {filePreview && file?.type === 'application/pdf' && (
                        <embed
                          src={filePreview}
                          type="application/pdf"
                          width="100%"
                          height="300px"
                          className="min-h-[200px]"
                        />
                      )}
                      {!file && formData.imagePdfUrl && (
                        <>
                          {formData.imagePdfUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                            <img
                              src={formData.imagePdfUrl}
                              alt="Main File Preview"
                              className="max-w-full h-auto max-h-48 object-contain"
                            />
                          ) : formData.imagePdfUrl.match(/\.pdf$/i) ? (
                            <embed
                              src={formData.imagePdfUrl}
                              type="application/pdf"
                              width="100%"
                              height="300px"
                              className="min-h-[200px]"
                            />
                          ) : (
                            <p className="text-sm text-gray-600">Preview not available for this URL</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Preview Image (JPG/PNG)</span>
                  </label>
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    accept="image/jpeg,image/png"
                    onChange={handlePreviewFileChange}
                  />
                  {previewFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {previewFile.name}
                    </p>
                  )}
                </div>
                {previewFileUrl && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Preview Image</span>
                    </label>
                    <div className="border rounded-lg p-2 bg-base-200 max-h-64 overflow-auto">
                      <img
                        src={previewFileUrl}
                        alt="Preview Image"
                        className="max-w-full h-auto max-h-48 object-contain"
                      />
                    </div>
                  </div>
                )}
                <div className="modal-action">
                  <button
                    type="submit"
                    className="btn btn-primary bg-gradient-to-r from-primary to-secondary text-primary-content border-none hover:from-primary-focus hover:to-secondary-focus hover:scale-110 transition-all duration-300"
                  >
                    {selectedContent ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setFile(null);
                      setFilePreview(null);
                      setPreviewFile(null);
                      setPreviewFileUrl(null);
                      if (filePreview) {
                        URL.revokeObjectURL(filePreview);
                      }
                      if (previewFileUrl) {
                        URL.revokeObjectURL(previewFileUrl);
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

          <input type="checkbox" id="delete-modal" className="modal-toggle" checked={isDeleteModalOpen} onChange={() => setIsDeleteModalOpen(!isDeleteModalOpen)} />
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