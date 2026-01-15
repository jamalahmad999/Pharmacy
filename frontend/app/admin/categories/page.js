"use client";

import { useState, useEffect } from "react";
import { Icons } from "@/components/Icons";

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'main', 'sub', 'subsub'
  const [creatingType, setCreatingType] = useState('main'); // 'main', 'sub', 'subsub'
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '📦',
    description: '',
    image: '',
    imageFile: null,
    banner: '',
    bannerFile: null,
    parentCategory: null,
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/admin/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('admin_token');
      
      const url = editingCategory 
        ? `${apiUrl}/api/admin/categories/${editingCategory._id}`
        : `${apiUrl}/api/admin/categories`;
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('slug', formData.slug);
      formDataToSend.append('icon', formData.icon);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('parentCategory', formData.parentCategory || '');
      formDataToSend.append('order', formData.order.toString());
      formDataToSend.append('isActive', formData.isActive.toString());
      
      // Add image file if selected
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }
      
      // Add banner file if selected
      if (formData.bannerFile) {
        formDataToSend.append('banner', formData.bannerFile);
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save category');
      }

      alert(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('admin_token');
      
      const response = await fetch(`${apiUrl}/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete category');

      alert('Category deleted successfully!');
      fetchCategories();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    // Determine category type based on hierarchy level
    let categoryType = 'main';
    if (category.parentCategory) {
      if (category.parentCategory.parentCategory) {
        categoryType = 'subsub'; // Has grandparent, so it's level 3
      } else {
        categoryType = 'sub'; // Has parent but no grandparent, so it's level 2
      }
    }
    setCreatingType(categoryType);
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon || '📦',
      description: category.description || '',
      image: category.image || '',
      imageFile: null,
      banner: category.banner || '',
      bannerFile: null,
      parentCategory: category.parentCategory || null,
      order: category.order || 0,
      isActive: category.isActive
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      icon: '📦',
      description: '',
      image: '',
      imageFile: null,
      banner: '',
      bannerFile: null,
      parentCategory: null,
      order: 0,
      isActive: true
    });
    setEditingCategory(null);
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // Filter categories based on selected filter
  const filteredCategories = categories.filter(category => {
    if (filterType === 'main') return !category.parentCategory;
    if (filterType === 'sub') {
      // A category is a sub-category if it has a parentCategory and that parent has no parentCategory
      return category.parentCategory && !category.parentCategory.parentCategory;
    }
    if (filterType === 'subsub') {
      // A category is a sub-sub-category if it has a parentCategory and that parent also has a parentCategory
      return category.parentCategory && category.parentCategory.parentCategory;
    }
    return true;
  });

  // Get only main categories for dropdown
  const mainCategories = categories.filter(cat => !cat.parentCategory);
  
  // Get subcategories (categories with main category as parent)
  const subCategories = categories.filter(cat => {
    return cat.parentCategory && !cat.parentCategory.parentCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icons.Loader className="w-8 h-8 text-[#002579] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories Management</h2>
          <p className="text-gray-600 mt-1">
            Manage main categories and their subcategories for the CategoryBar
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              resetForm();
              setCreatingType('main');
              setFormData(prev => ({ ...prev, parentCategory: null }));
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Icons.Plus className="w-5 h-5" />
            Add Main Category
          </button>
          <button
            onClick={() => {
              if (mainCategories.length === 0) {
                alert('Please create a main category first!');
                return;
              }
              resetForm();
              setCreatingType('sub');
              setFormData(prev => ({ ...prev, parentCategory: mainCategories[0]._id }));
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icons.Plus className="w-5 h-5" />
            Add Subcategory
          </button>
          <button
            onClick={() => {
              if (subCategories.length === 0) {
                alert('Please create a subcategory first!');
                return;
              }
              resetForm();
              setCreatingType('subsub');
              setFormData(prev => ({ ...prev, parentCategory: subCategories[0]._id }));
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Icons.Plus className="w-5 h-5" />
            Add Sub-subcategory
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-[#002579] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({categories.length})
            </button>
            <button
              onClick={() => setFilterType('main')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'main'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏷️ Main Categories ({categories.filter(c => !c.parentCategory).length})
            </button>
            <button
              onClick={() => setFilterType('sub')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'sub'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📂 Subcategories ({categories.filter(c => c.parentCategory && !c.parentCategory.parentCategory).length})
            </button>
            <button
              onClick={() => setFilterType('subsub')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'subsub'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📁 Sub-subcategories ({categories.filter(c => c.parentCategory && c.parentCategory.parentCategory).length})
            </button>
          </div>
        </div>
        
        {/* Info box */}
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 How it works:</strong> 
            <br/>• <strong className="text-purple-600">Main Categories</strong> appear in the "Shop by Category" dropdown
            <br/>• <strong className="text-blue-600">Subcategories</strong> are nested under their parent main category
            <br/>• <strong className="text-green-600">Sub-subcategories</strong> are nested under their parent subcategory
          </p>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Icon</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCategories.map((category) => {
              const isMainCategory = !category.parentCategory;
              const parentCategory = category.parentCategory;
              const isSubCategory = parentCategory && !parentCategory.parentCategory;
              const isSubSubCategory = parentCategory && parentCategory.parentCategory;
              
              const parentCategoryName = parentCategory ? parentCategory.name : null;
              const grandParentCategoryName = parentCategory && parentCategory.parentCategory 
                ? parentCategory.parentCategory.name 
                : null;
              
              const subCategoryCount = isMainCategory 
                ? categories.filter(c => c.parentCategory && c.parentCategory._id === category._id).length 
                : 0;
              const subSubCategoryCount = isSubCategory
                ? categories.filter(c => c.parentCategory && c.parentCategory._id === category._id).length
                : 0;
              
              return (
                <tr key={category._id} className={`hover:bg-gray-50 ${
                  isSubCategory ? 'bg-blue-50/30' : isSubSubCategory ? 'bg-green-50/30' : ''
                }`}>
                  <td className="px-6 py-4">
                    <span className="text-2xl">{category.icon}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {isSubCategory && <span className="text-gray-400">↳</span>}
                      {isSubSubCategory && <span className="text-gray-400">↳↳</span>}
                      <div>
                        <p className="font-semibold text-gray-900">{category.name}</p>
                        {category.description && (
                          <p className="text-sm text-gray-600">{category.description}</p>
                        )}
                        {parentCategoryName && (
                          <p className="text-xs text-blue-600 mt-1">
                            ↳ under {grandParentCategoryName ? `${grandParentCategoryName} > ` : ''}{parentCategoryName}
                          </p>
                        )}
                        {isMainCategory && subCategoryCount > 0 && (
                          <p className="text-xs text-purple-600 mt-1">
                            📂 {subCategoryCount} subcategor{subCategoryCount === 1 ? 'y' : 'ies'}
                          </p>
                        )}
                        {isSubCategory && subSubCategoryCount > 0 && (
                          <p className="text-xs text-green-600 mt-1">
                            📁 {subSubCategoryCount} sub-subcategor{subSubCategoryCount === 1 ? 'y' : 'ies'}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      isMainCategory 
                        ? 'bg-purple-100 text-purple-700' 
                        : isSubCategory
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {isMainCategory ? '🏷️ Main' : isSubCategory ? '📂 Sub' : '📁 Sub-sub'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{category.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{category.order}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      category.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Icons.Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Icons.Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingCategory 
                    ? 'Edit Category' 
                    : (creatingType === 'main' ? 'Add Main Category' : creatingType === 'sub' ? 'Add Subcategory' : 'Add Sub-subcategory')
                  }
                </h3>
                {!editingCategory && (
                  <p className="text-sm text-gray-600 mt-1">
                    {creatingType === 'main' 
                      ? '🏷️ This will appear in the CategoryBar dropdown' 
                      : creatingType === 'sub'
                      ? '📂 This will be nested under a main category'
                      : '📁 This will be nested under a subcategory'
                    }
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Icons.Close className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Show parent category dropdown for subcategories and sub-subcategories */}
              {(creatingType === 'sub' || creatingType === 'subsub' || (editingCategory && editingCategory.parentCategory)) && (
                <div className={`p-4 border rounded-lg ${
                  creatingType === 'sub' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
                }`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {creatingType === 'sub' ? 'Parent Main Category *' : 'Parent Category *'}
                  </label>
                  <select
                    value={formData.parentCategory || ''}
                    onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={creatingType === 'sub' || creatingType === 'subsub'}
                  >
                    <option value="">
                      {creatingType === 'sub' ? 'Select a main category' : 'Select a parent category'}
                    </option>
                    {creatingType === 'sub' ? (
                      // For subcategories, show only main categories
                      mainCategories.map(cat => (
                        <option key={cat._id} value={cat._id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))
                    ) : (
                      // For sub-subcategories, show subcategories
                      subCategories.map(cat => (
                        <option key={cat._id} value={cat._id}>
                          {cat.icon} {cat.parentCategory?.name} &gt; {cat.name}
                        </option>
                      ))
                    )}
                  </select>
                  <p className="text-xs mt-1" style={{ color: creatingType === 'sub' ? '#2563eb' : '#16a34a' }}>
                    {creatingType === 'sub' 
                      ? 'This subcategory will appear nested under the selected main category'
                      : 'This sub-subcategory will appear nested under the selected subcategory'
                    }
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {creatingType === 'main' ? 'Main Category Name *' : creatingType === 'sub' ? 'Subcategory Name *' : 'Sub-subcategory Name *'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (!editingCategory) {
                      setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579]"
                  required
                  placeholder={
                    creatingType === 'main' 
                      ? "e.g., Beauty Care, Hair Care, Makeup" 
                      : creatingType === 'sub'
                      ? "e.g., Shampoo, Face Makeup, Treatments"
                      : "e.g., Herbal Shampoo, Mineral Makeup, Laser Treatments"
                  }
                />
                {creatingType === 'main' && (
                  <p className="text-xs text-gray-500 mt-1">
                    This will appear as a main option in the CategoryBar dropdown
                  </p>
                )}
                {creatingType === 'sub' && (
                  <p className="text-xs text-gray-500 mt-1">
                    This will appear as a subcategory under a main category
                  </p>
                )}
                {creatingType === 'subsub' && (
                  <p className="text-xs text-gray-500 mt-1">
                    This will appear as a sub-subcategory under a subcategory
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon Emoji</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579]"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579]"
                />
                {formData.image && !formData.imageFile && (
                  <p className="text-xs text-gray-500 mt-1">
                    Current image: {formData.image}
                  </p>
                )}
                {formData.imageFile && (
                  <p className="text-xs text-green-600 mt-1">
                    New image selected: {formData.imageFile.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Banner (displays on products page)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, bannerFile: e.target.files[0] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579]"
                />
                {formData.banner && !formData.bannerFile && (
                  <p className="text-xs text-gray-500 mt-1">
                    Current banner: {formData.banner}
                  </p>
                )}
                {formData.bannerFile && (
                  <p className="text-xs text-green-600 mt-1">
                    New banner selected: {formData.bannerFile.name}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#002579]"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-[#002579] text-white rounded-lg hover:bg-[#001845] transition-colors"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
