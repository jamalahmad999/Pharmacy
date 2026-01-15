"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', 
    slug: '', 
    description: '', 
    price: '', 
    salePrice: '',
    stock: '', 
    category: '', 
    brand: '', 
    sku: '', 
    images: [],
    rating: { average: 0, count: 0 }
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      console.log('Fetching products from:', `${apiUrl}/api/admin/products`);
      
      const response = await fetch(`${apiUrl}/api/admin/products?limit=1600`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error loading products. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/admin/categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      console.error('Error:', error);
      setCategories([]);
    }
  };

  const fetchBrands = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/admin/brands`);
      if (!response.ok) throw new Error('Failed to fetch brands');
      const data = await response.json();
      setBrands(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
      setBrands([]);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await fetch(`${apiUrl}/api/admin/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpload
      });

      if (!response.ok) throw new Error('Failed to upload image');
      
      const data = await response.json();
      // Cloudinary returns full URL, no need to prepend apiUrl
      const imageUrl = data.imageUrl;
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const url = editingProduct 
        ? `${apiUrl}/api/admin/products/${editingProduct._id}`
        : `${apiUrl}/api/admin/products`;
      
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save');
      
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', slug: '', description: '', price: '', salePrice: '', stock: '', category: '', brand: '', sku: '', images: [], rating: { average: 0, count: 0 } });
      fetchProducts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProducts();
    } catch (error) {
      alert('Error deleting product');
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      salePrice: product.salePrice || '',
      stock: product.stock,
      category: product.category?._id || '',
      brand: product.brand || '',
      sku: product.sku || '',
      images: product.images || [],
      rating: product.rating || { average: 0, count: 0 }
    });
    setShowModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <div className="flex gap-3">
            <button onClick={() => { setShowModal(true); setEditingProduct(null); setFormData({ name: '', slug: '', description: '', price: '', salePrice: '', stock: '', category: '', brand: '', sku: '', images: [], rating: { average: 0, count: 0 } }); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Product</button>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? <div className="text-center py-12">Loading...</div> : (
          <>
            {/* Products count info */}
            <div className="mb-4 text-sm text-gray-600">
              Total: {products.length} products
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{product.category?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">AED {product.price}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-800">Edit</button>
                        <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Name*</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required /></div>
                <div><label className="block text-sm font-medium mb-1">Slug*</label><input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Description*</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg" rows="3" required /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium mb-1">Original Price (AED)*</label><input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required /></div>
                <div><label className="block text-sm font-medium mb-1">Sale Price (AED)</label><input type="number" step="0.01" value={formData.salePrice} onChange={(e) => setFormData({...formData, salePrice: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Optional" /></div>
                <div><label className="block text-sm font-medium mb-1">Stock*</label><input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Rating (0-5)</label><input type="number" step="0.1" min="0" max="5" value={formData.rating.average} onChange={(e) => setFormData({...formData, rating: { ...formData.rating, average: parseFloat(e.target.value) || 0 }})} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Review Count</label><input type="number" min="0" value={formData.rating.count} onChange={(e) => setFormData({...formData, rating: { ...formData.rating, count: parseInt(e.target.value) || 0 }})} className="w-full px-3 py-2 border rounded-lg" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category*</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <select value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                    <option value="">Select Brand</option>
                    {brands.map(brand => <option key={brand._id} value={brand.name}>{brand.name}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="block text-sm font-medium mb-1">SKU</label><input type="text" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Product Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="w-full" />
                  {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Product ${idx + 1}`} className="w-full h-20 object-cover rounded" />
                          <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}