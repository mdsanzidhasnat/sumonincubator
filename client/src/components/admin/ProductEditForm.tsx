import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Upload, Package, DollarSign, Star, FileText, Percent, BarChart3, Trash2 } from 'lucide-react';
import { getProduct } from '../../lib/api';

interface FormData {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  categoryId: string;
  categoryBn: string;
  sku: string;
  price: string;
  originalPrice: string;
  discountPct: string;
  rating: string;
  reviewCount: string;
  stockQty: string;
  description: string;
  descriptionBn: string;
  images: string[];
  isBestseller: boolean;
  isFeatured: boolean;
  specs: {
    capacity?: string;
    power?: string;
    controller?: string;
    warranty?: string;
    dimension?: string;
    hatchRate?: string;
  };
}

const categories = [
  { id: 'incubators', name: 'Automatic Egg Incubators', nameBn: 'অটোমেটিক ডিম ইনকিউবেটর' },
  { id: 'parts', name: 'Incubator Spare Parts', nameBn: 'ইনকিউবেটর পার্টস ও কিটস' },
  { id: 'ips-ups', name: 'IPS & UPS', nameBn: 'হোম আইপিএস' },
  { id: 'battery', name: 'Solar & IPS Battery', nameBn: 'আইপিএস ও সোলার ব্যাটারি' },
  { id: 'agri-tools', name: 'Agriculture Tools', nameBn: 'কৃষি প্রযুক্তি সরঞ্জাম' },
  { id: 'gadgets', name: 'Electronic Gadgets', nameBn: 'ইলেকট্রনিক গ্যাজেট ও টাইমাস' },
];

export const ProductEditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        const product = await getProduct(id);
        setFormData({
          id: product.id,
          title: product.title,
          titleBn: product.titleBn,
          category: product.category,
          categoryId: product.categoryId,
          categoryBn: product.categoryBn,
          sku: product.sku,
          price: product.price.toString(),
          originalPrice: product.originalPrice.toString(),
          discountPct: product.discountPct.toString(),
          rating: product.rating.toString(),
          reviewCount: product.reviewCount.toString(),
          stockQty: product.stockQty.toString(),
          description: product.description,
          descriptionBn: product.descriptionBn,
          images: product.images,
          isBestseller: product.isBestseller,
          isFeatured: product.isFeatured,
          specs: product.specs,
        });
      } catch (error) {
        console.error('Failed to load product:', error);
        alert('Failed to load product. Please try again.');
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    const payload = {
      sku: formData.sku,
      title: formData.title,
      titleBn: formData.titleBn,
      categoryKey: formData.categoryId,
      priceCents: Math.round(parseFloat(formData.price) * 100),
      originalPriceCents: formData.originalPrice ? Math.round(parseFloat(formData.originalPrice) * 100) : undefined,
      currency: 'BDT',
      stockQty: parseInt(formData.stockQty) || 0,
      rating: parseFloat(formData.rating) || 0,
      reviewCount: parseInt(formData.reviewCount) || 0,
      images: formData.images,
      isBestseller: formData.isBestseller,
      isFeatured: formData.isFeatured,
      specs: formData.specs,
      description: formData.description,
      descriptionBn: formData.descriptionBn,
    };

    try {
      const response = await fetch(`/api/v1/products/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
      });
      if (response.ok) {
        alert('Product updated successfully!');
        navigate('/admin/products');
      } else {
        const error = await response.text();
        alert(`Failed to update product: ${error}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/v1/products/${formData?.id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (response.ok) {
        alert('Product deleted successfully!');
        navigate('/admin/products');
      } else {
        const error = await response.text();
        alert(`Failed to delete product: ${error}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: any) => {
    if (!formData) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (categoryId: string) => {
    if (!formData) return;
    const selected = categories.find(c => c.id === categoryId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        categoryId,
        category: selected.name,
        categoryBn: selected.nameBn,
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-bismillah-primaryGreen"></div>
        <p className="ml-2 text-slate-600">Loading product...</p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Product not found</p>
        <button
          onClick={() => navigate('/admin/products')}
          className="mt-4 inline-flex items-center gap-2 text-bismillah-primaryGreen hover:text-emerald-700"
        >
          <X className="w-4 h-4" />
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Product</h1>
          <p className="text-slate-600 mt-2">Update product information</p>
        </div>
        <button
          onClick={() => navigate('/admin/products')}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-sharp border border-bismillah-borderLight p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-bismillah-primaryGreen" />
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Product Name (English)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                className="w-full px-3 py-2 border border-bismillah-borderLight rounded-sharp focus:outline-none focus:border-bismillah-primaryGreen"
                placeholder="Enter product name in English"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Product Name (Bengali)</label>
              <input
                type="text"
                value={formData.titleBn}
                onChange={(e) => handleChange('titleBn', e.target.value)}
                required
                className="w-full px-3 py-2 border border-bismillah-borderLight rounded-sharp focus:outline-none focus:border-bismillah-primaryGreen"
                placeholder="Enter product name in Bengali"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">SKU (Stock Keeping Unit)</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
                required
                className="w-full px-3 py-2 border border-bismillah-borderLight rounded-sharp focus:outline-none focus:border-bismillah-primaryGreen"
                placeholder="Unique SKU identifier"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                required
                className="w-full px-3 py-2 border border-bismillah-borderLight rounded-sharp focus:outline-none focus:border-bismillah-primaryGreen"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-sharp border border-bismillah-borderLight p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-bismillah-primaryGreen" />
            Pricing Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Sale Price (BDT)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                required
                step="0.01"
                className="w-full px-3 py-2 border border-bismillah-borderLight rounded-sharp focus:outline-none focus:border-bismillah-primaryGreen"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Original Price (BDT)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => handleChange('originalPrice', e.target.value)}
                step="0.01"
                className="w-full px-3 py-2 border border-bismillah-borderLight rounded-sharp focus:outline-none focus:border-bismillah-primaryGreen"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Discount (%)</label>
              <input
                type="number"
                value={formData.discountPct}
                onChange={(e) => handleChange('discountPct', e.target.value)}
                step="1"
                className="w-full px-3 py-2 border border-bismillah-borderLight rounded-sharp focus:outline-none focus:border-bismillah-primaryGreen"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-sharp border border-bismillah-borderLight p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-bismillah-primaryGreen" />
            Product Details
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description (English)</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-bismillah-borderLight rounded-sharp focus:outline-none focus:border-bismillah-primaryGreen"
                placeholder="Describe the product in English"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description (Bengali)</label>
              <textarea
                value={formData.descriptionBn}
                onChange={(e) => handleChange('descriptionBn', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-bismillah-borderLight rounded-sharp focus:outline-none focus:border-bismillah-primaryGreen"
                placeholder="Describe the product in Bengali"
              />
            </div>
          </div>
        </div>

        {/* Status & Inventory */}
        <div className="bg-white rounded-sharp border border-bismillah-borderLight p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-bismillah-primaryGreen" />
            Status & Inventory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Rating</label>
              <input
                type="number"
                value={formData.rating}
                onChange={(e) => handleChange('rating', e.target.value)}
                min="0"
                max="5"
                step="0.1"
                className="w-full px-3 py-2 border border-bismillah-borderLight rounded-sharp focus:outline-none focus:border-bismillah-primaryGreen"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Review Count</label>
              <input
                type="number"
                value={formData.reviewCount}
                onChange={(e) => handleChange('reviewCount', e.target.value)}
                min="0"
                className="w-full px-3 py-2 border border-bismillah-borderLight rounded-sharp focus:outline-none focus:border-bismillah-primaryGreen"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Stock Quantity</label>
              <input
                type="number"
                value={formData.stockQty}
                onChange={(e) => handleChange('stockQty', e.target.value)}
                min="0"
                className="w-full px-3 py-2 border border-bismillah-borderLight rounded-sharp focus:outline-none focus:border-bismillah-primaryGreen"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Product Images (URLs)</label>
              <input
                type="text"
                placeholder="Image URL"
                className="w-full px-3 py-2 border border-bismillah-borderLight rounded-sharp focus:outline-none focus:border-bismillah-primaryGreen"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    setFormData(prev => ({
                      ...prev,
                      images: [...(prev?.images || []), e.currentTarget.value]
                    }));
                    e.currentTarget.value = '';
                  }
                }}
              />
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative bg-slate-100 rounded-sharp p-1">
                      <img src={image} alt="Product" className="w-16 h-16 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }))}
                        className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isBestseller-edit"
                checked={formData.isBestseller}
                onChange={(e) => handleChange('isBestseller', e.target.checked)}
                className="w-4 h-4 text-bismillah-primaryGreen border-bismillah-borderLight rounded focus:ring-bismillah-primaryGreen"
              />
              <label htmlFor="isBestseller-edit" className="text-sm font-medium text-slate-700">Mark as Bestseller</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isFeatured-edit"
                checked={formData.isFeatured}
                onChange={(e) => handleChange('isFeatured', e.target.checked)}
                className="w-4 h-4 text-bismillah-primaryGreen border-bismillah-borderLight rounded focus:ring-bismillah-primaryGreen"
              />
              <label htmlFor="isFeatured-edit" className="text-sm font-medium text-slate-700">Featured Product</label>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-sharp transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : 'Delete Product'}
          </button>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-2 border border-bismillah-borderLight text-slate-700 font-medium rounded-sharp hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-bismillah-primaryGreen hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-sharp transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
