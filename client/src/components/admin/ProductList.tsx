import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { Product } from '../../types';
import { getProducts } from '../../lib/api';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['all', 'incubators', 'parts', 'ips-ups', 'battery', 'agri-tools', 'gadgets'];

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const query: any = {
          page: currentPage,
          limit: 12,
          sort: 'featured',
        };
        if (search) query.q = search;
        if (categoryFilter && categoryFilter !== 'all') query.category = categoryFilter;
        const response = await getProducts(query);
        setProducts(response.items);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, search, categoryFilter]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/v1/products/${id}`, {
          method: 'DELETE',
          credentials: 'same-origin',
        });
        if (response.ok) {
          setProducts(products.filter((p) => p.id !== id));
        }
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    if (categoryFilter === 'all') return true;
    return product.categoryId === categoryFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Product Management</h1>
          <p className="text-slate-600 mt-1">Manage your product catalog</p>
        </div>
        <Link
          to="/admin/products/create"
          className="inline-flex items-center gap-2 bg-bismillah-primaryGreen hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-sharp transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-sharp border border-bismillah-borderLight p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-bismillah-borderLight rounded-sharp focus:outline-none focus:border-bismillah-primaryGreen"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-8 py-2 border border-bismillah-borderLight rounded-sharp focus:outline-none focus:border-bismillah-primaryGreen appearance-none bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-bismillah-primaryGreen"></div>
            <p className="mt-2 text-slate-600">Loading products...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-sharp border border-bismillah-borderLight hover:border-bismillah-primaryGreen transition-all duration-200 overflow-hidden"
                >
                  <div className="relative aspect-4/3 bg-slate-50 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.discountPct > 0 && (
                      <div className="absolute top-2 left-2 bg-bismillah-accentYellow text-slate-950 font-bold text-xs px-2 py-1 rounded-sm">
                        -{product.discountPct}% OFF
                      </div>
                    )}
                    {product.isBestseller && (
                      <div className="absolute top-2 right-2 bg-bismillah-primaryGreen text-white text-xs font-bold px-2 py-1 rounded-sm">
                        BESTSELLER
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-bismillah-primaryGreen bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-sm">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <span className="text-bismillah-accentYellow">★</span>
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mb-2 line-clamp-2">
                      {product.title}
                    </h3>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-black text-bismillah-primaryGreen">
                          ৳ {product.price.toLocaleString()}
                        </span>
                        {product.discountPct > 0 && (
                          <span className="text-xs text-slate-400 line-through ml-2">
                            ৳ {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1 bg-slate-50 hover:bg-bismillah-primaryGreen/10 text-slate-700 hover:text-bismillah-primaryGreen font-medium py-2 px-3 rounded-sharp transition-colors text-sm"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white font-medium py-2 px-3 rounded-sharp transition-colors text-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">No products found</p>
                <Link
                  to="/admin/products/create"
                  className="inline-flex items-center gap-2 bg-bismillah-primaryGreen hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-sharp transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Product
                </Link>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-sharp font-medium transition-colors ${currentPage === page
                            ? 'bg-bismillah-primaryGreen text-white'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}
                        `}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
