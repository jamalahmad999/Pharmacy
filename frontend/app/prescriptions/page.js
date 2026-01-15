"use client";

import { useState } from "react";
import { Icons } from "@/components/Icons";

export default function PrescriptionsPage() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    location: '',
    notes: ''
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      await uploadToCloudinary(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    setUploading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const formData = new FormData();
      formData.append('prescription', file);

      console.log('Uploading to:', `${apiUrl}/api/prescriptions/upload`);

      const response = await fetch(`${apiUrl}/api/prescriptions/upload`, {
        method: 'POST',
        body: formData
      });

      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error(`Failed to upload file: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Upload success:', data);
      
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        url: data.url,
        publicId: data.publicId
      };

      setUploadedFiles(prev => [...prev, newFile]);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one prescription');
      return;
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/prescriptions/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          location: formData.location,
          notes: formData.notes,
          prescriptionUrls: uploadedFiles.map(f => f.url)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit prescription');
      }

      const data = await response.json();
      
      alert(`Prescription submitted successfully! Order ID: ${data.data.orderId}`);
      
      // Reset form
      setUploadedFiles([]);
      setFormData({
        name: '',
        phone: '',
        address: '',
        location: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error submitting prescription:', error);
      alert('Failed to submit prescription: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-[#002579] transition-colors">Home</a>
            <Icons.ChevronRight className="w-4 h-4" />
            <span className="font-semibold text-gray-900">Upload Prescription</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Icons.Cross className="w-10 h-10 text-[#002579]" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Your Prescription</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a photo of your prescription and we'll prepare your medicines for delivery
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div
            className={`border-3 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
              dragActive
                ? 'border-[#002579] bg-blue-50'
                : 'border-gray-300 hover:border-[#002579]'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*,.pdf"
              onChange={handleChange}
              className="hidden"
            />
            
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Icons.ArrowRight className="w-8 h-8 text-[#002579] transform rotate-90" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {dragActive ? "Drop your files here" : uploading ? "Uploading..." : "Drop your prescription here"}
            </h3>
            <p className="text-gray-600 mb-6">or</p>
            
            <label
              htmlFor="file-upload"
              className={`inline-flex items-center gap-2 px-8 py-3 bg-[#002579] hover:bg-[#001a5c] text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {uploading ? (
                <>
                  <Icons.Loader className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Icons.ShoppingBag className="w-5 h-5" />
                  Browse Files
                </>
              )}
            </label>

            <p className="text-sm text-gray-500 mt-4">
              Supported formats: JPG, PNG, PDF (Max 10MB per file)
            </p>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-8">
              <h3 className="font-bold text-gray-900 mb-4">Uploaded Files ({uploadedFiles.length})</h3>
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icons.Check className="w-5 h-5 text-[#002579]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Icons.Close className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002579] focus:border-[#002579]"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002579] focus:border-[#002579]"
                placeholder="+971 XX XXX XXXX"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Delivery Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="3"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002579] focus:border-[#002579]"
              placeholder="Enter your delivery address"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002579] focus:border-[#002579]"
              placeholder="Enter your location (e.g., Dubai, Abu Dhabi)"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              rows="3"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002579] focus:border-[#002579]"
              placeholder="Any special instructions or requirements..."
            />
          </div>

          <button
            type="submit"
            disabled={uploadedFiles.length === 0 || submitting}
            className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
              uploadedFiles.length === 0 || submitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#002579] hover:bg-[#001a5c] text-white hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            {submitting ? (
              <>
                <Icons.Loader className="w-6 h-6 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Icons.CheckCircle className="w-6 h-6" />
                Submit Prescription
              </>
            )}
          </button>
        </form>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Verified</h3>
            <p className="text-sm text-gray-600">Prescription verified by licensed pharmacists</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.MapPin className="w-6 h-6 text-[#002579]" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-600">Medicines delivered to your doorstep</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.Phone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-sm text-gray-600">Expert support available anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
}

