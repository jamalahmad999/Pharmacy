'use client';

import { useEffect, useState } from 'react';
import { Icons } from '@/components';
import Link from 'next/link';

export default function PrescriptionsAdminPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Prescriptions' },
    { value: 'pending', label: 'Pending' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'completed', label: 'Completed' }
  ];

  useEffect(() => {
    fetchPrescriptions();
  }, [selectedStatus, searchQuery, page]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        ...(searchQuery && { search: searchQuery })
      });

      const response = await fetch(`${apiUrl}/api/prescriptions/admin/all?${params}`);
      const data = await response.json();

      if (data.success) {
        setPrescriptions(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      alert('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (prescriptionId, newStatus) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/prescriptions/admin/${prescriptionId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        fetchPrescriptions();
        if (showDetailModal) {
          setSelectedPrescription(data.data);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update prescription status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  return (
    <div className="w-full h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900">Prescriptions Management</h1>
        <p className="text-gray-500 mt-1">Manage customer prescription submissions</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name, phone, or address..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Prescriptions Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading prescriptions...</div>
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Icons.Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No prescriptions found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Patient Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Images
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {prescriptions.map((prescription) => (
                    <tr key={prescription._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {prescription.patientName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {prescription.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          {prescription.prescriptionImages.length} image{prescription.prescriptionImages.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(prescription.status)}`}>
                          {prescription.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => {
                            setSelectedPrescription(prescription);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Prescription Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icons.Close className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Patient Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Patient Name</p>
                    <p className="text-base font-medium text-gray-900">{selectedPrescription.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-base font-medium text-gray-900">{selectedPrescription.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-base font-medium text-gray-900">{selectedPrescription.address}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-base font-medium text-gray-900">{selectedPrescription.location}</p>
                  </div>
                  {selectedPrescription.notes && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Notes</p>
                      <p className="text-base text-gray-900">{selectedPrescription.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Prescription Images */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescription Images ({selectedPrescription.prescriptionImages.length})</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedPrescription.prescriptionImages.map((image, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={`Prescription ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3 bg-gray-50 border-t border-gray-200">
                        <a
                          href={image.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 text-xs font-medium truncate block"
                        >
                          View Original
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Management */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Management</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Change Status</label>
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.slice(1).map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleStatusChange(selectedPrescription._id, option.value)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedPrescription.status === option.value
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedPrescription.adminNotes && (
                    <div>
                      <p className="text-sm text-gray-600">Admin Notes</p>
                      <p className="text-base text-gray-900">{selectedPrescription.adminNotes}</p>
                    </div>
                  )}

                  {selectedPrescription.rejectionReason && (
                    <div>
                      <p className="text-sm text-gray-600">Rejection Reason</p>
                      <p className="text-base text-red-600">{selectedPrescription.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p>Submitted</p>
                    <p className="font-medium text-gray-900">{new Date(selectedPrescription.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p>Last Updated</p>
                    <p className="font-medium text-gray-900">{new Date(selectedPrescription.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
