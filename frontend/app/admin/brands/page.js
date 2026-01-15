"use client";

import { useState, useEffect } from "react";
import { Icons } from "@/components/Icons";

export default function BrandsManagement() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo: '',
    description: '',
    website: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/admin/brands`);
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('admin_token');
      
      const formDataUpload = new FormData();
      formDataUpload.append('logo', file);

      const response = await fetch(`${apiUrl}/api/admin/brands/upload-logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      if (!response.ok) throw new Error('Failed to upload logo');

      const data = await response.json();
      // Cloudinary returns full URL, no need to prepend apiUrl
      setFormData({ ...formData, logo: data.logoUrl });
      alert('Logo uploaded successfully!');
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('admin_token');
      
      const url = editingBrand 
        ? `${apiUrl}/api/admin/brands/${editingBrand._id}`
        : `${apiUrl}/api/admin/brands`;
      
      const response = await fetch(url, {
        method: editingBrand ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save brand');
      }

      alert(editingBrand ? 'Brand updated!' : 'Brand created!');
      setShowModal(false);
      resetForm();
      fetchBrands();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this brand?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('admin_token');
      
      await fetch(`${apiUrl}/api/admin/brands/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert('Brand deleted!');
      fetchBrands();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo || '',
      description: brand.description || '',
      website: brand.website || '',
      order: brand.order || 0,
      isActive: brand.isActive
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', logo: '', description: '', website: '', order: 0, isActive: true });
    setEditingBrand(null);
  };

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (loading) return <div className="flex items-center justify-center h-64"><Icons.Loader className="w-8 h-8 text-[#002579] animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Brands Management</h2>
          <p className="text-gray-600 mt-1">Manage product brands</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-[#002579] text-white rounded-lg hover:bg-[#001845]">
          <Icons.Plus className="w-5 h-5" />Add Brand
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Logo</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {brands.map((brand) => (
              <tr key={brand._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="w-12 h-12 object-contain" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <Icons.Tag className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold">{brand.name}</p>
                  {brand.website && <a href={brand.website} target="_blank" className="text-xs text-blue-600">{brand.website}</a>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{brand.slug}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${brand.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {brand.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(brand)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Icons.Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(brand._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Icons.Trash className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{editingBrand ? 'Edit Brand' : 'Add Brand'}</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg"><Icons.Close className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Brand Name *</label>
                <input type="text" value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (!editingBrand) setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) })); }} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#002579]" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#002579]" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Brand Logo</label>
                <div className="space-y-3">
                  {/* File Upload */}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                      <Icons.Upload className="w-5 h-5" />
                      <span className="text-sm font-medium">{uploading ? 'Uploading...' : 'Upload Logo'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    {formData.logo && (
                      <img src={formData.logo} alt="Logo preview" className="h-12 w-12 object-contain border rounded" />
                    )}
                  </div>
                  {/* OR separator */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="text-xs text-gray-500">OR</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                  {/* URL Input */}
                  <input 
                    type="text" 
                    value={formData.logo} 
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })} 
                    placeholder="Enter logo URL"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#002579]" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#002579]" rows="3" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#002579]" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
                <label htmlFor="isActive" className="text-sm font-medium">Active</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 py-2 px-4 bg-[#002579] text-white rounded-lg hover:bg-[#001845]">{editingBrand ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
