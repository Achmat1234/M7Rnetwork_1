import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  TrendingUp,
  Package,
  ShoppingCart,
  Eye,
  Star,
  Crown,
  Upload,
  Save,
  X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const ProductManagement = () => {
  const { user, isOwner } = useAuth()
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "MaRk7Raw Classic Black Tee",
      category: "Classic",
      price: 299,
      originalPrice: 399,
      stock: 50,
      sold: 124,
      rating: 4.8,
      status: "active",
      createdAt: "2024-01-15",
      images: ["/api/placeholder/100/100"]
    },
    {
      id: 2,
      name: "MaRk7Raw Signature Logo Tee",
      category: "Signature",
      price: 349,
      originalPrice: 449,
      stock: 35,
      sold: 89,
      rating: 4.9,
      status: "active",
      createdAt: "2024-01-10",
      images: ["/api/placeholder/100/100"]
    },
    {
      id: 3,
      name: "MaRk7Raw Limited Edition",
      category: "Limited",
      price: 499,
      originalPrice: 599,
      stock: 15,
      sold: 67,
      rating: 5.0,
      status: "active",
      createdAt: "2024-01-05",
      images: ["/api/placeholder/100/100"]
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    sizes: [],
    colors: [],
    images: []
  })

  const categories = ['Classic', 'Signature', 'Limited', 'Accessories']
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const colors = ['Black', 'White', 'Grey', 'Navy', 'Burgundy', 'Gold']

  // Redirect if not owner
  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Owner Access Required</h1>
          <p className="text-gray-300">This section is only available to store owners.</p>
        </div>
      </div>
    )
  }

  const stats = {
    totalProducts: products.length,
    totalRevenue: products.reduce((sum, p) => sum + (p.price * p.sold), 0),
    totalSold: products.reduce((sum, p) => sum + p.sold, 0),
    avgRating: products.reduce((sum, p) => sum + p.rating, 0) / products.length
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleAddProduct = () => {
    const productData = {
      ...newProduct,
      id: Date.now(),
      sold: 0,
      rating: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setProducts(prev => [productData, ...prev])
    setNewProduct({
      name: '',
      description: '',
      category: '',
      price: '',
      originalPrice: '',
      stock: '',
      sizes: [],
      colors: [],
      images: []
    })
    setShowAddModal(false)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setNewProduct(product)
    setShowAddModal(true)
  }

  const handleUpdateProduct = () => {
    setProducts(prev => 
      prev.map(p => p.id === editingProduct.id ? { ...newProduct } : p)
    )
    setEditingProduct(null)
    setNewProduct({
      name: '',
      description: '',
      category: '',
      price: '',
      originalPrice: '',
      stock: '',
      sizes: [],
      colors: [],
      images: []
    })
    setShowAddModal(false)
  }

  const handleDeleteProduct = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
  }

  const toggleProductStatus = (id) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
          : p
      )
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Crown className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Product Management</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Total Products</p>
                <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-white">R{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-purple-500/20 border border-purple-400/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Total Sold</p>
                <p className="text-2xl font-bold text-white">{stats.totalSold}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 text-sm font-medium">Avg Rating</p>
                <p className="text-2xl font-bold text-white">{stats.avgRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-gray-800">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-gray-800">All Status</option>
                <option value="active" className="bg-gray-800">Active</option>
                <option value="inactive" className="bg-gray-800">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 text-gray-300 font-semibold">Product</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Category</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Price</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Stock</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Sold</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Rating</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Status</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <div className="text-white font-semibold">{product.name}</div>
                          <div className="text-gray-400 text-sm">Created: {product.createdAt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-semibold">R{product.price}</div>
                      {product.originalPrice > product.price && (
                        <div className="text-gray-400 line-through text-sm">R{product.originalPrice}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`text-sm font-semibold ${
                        product.stock < 10 ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4 text-white">{product.sold}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white">{product.rating}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleProductStatus(product.id)}
                        className={`px-3 py-1 rounded text-sm font-semibold ${
                          product.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {product.status}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-2 rounded-lg transition-all duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingProduct(null)
                    setNewProduct({
                      name: '',
                      description: '',
                      category: '',
                      price: '',
                      originalPrice: '',
                      stock: '',
                      sizes: [],
                      colors: [],
                      images: []
                    })
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" className="bg-gray-800">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-gray-800">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  placeholder="Product Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <input
                    type="number"
                    placeholder="Original Price"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, originalPrice: e.target.value }))}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <input
                    type="number"
                    placeholder="Stock"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Available Sizes</label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {sizes.map(size => (
                      <label key={size} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newProduct.sizes?.includes(size)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewProduct(prev => ({ 
                                ...prev, 
                                sizes: [...(prev.sizes || []), size] 
                              }))
                            } else {
                              setNewProduct(prev => ({ 
                                ...prev, 
                                sizes: (prev.sizes || []).filter(s => s !== size) 
                              }))
                            }
                          }}
                          className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded"
                        />
                        <span className="text-gray-300 text-sm">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Available Colors</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {colors.map(color => (
                      <label key={color} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newProduct.colors?.includes(color)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewProduct(prev => ({ 
                                ...prev, 
                                colors: [...(prev.colors || []), color] 
                              }))
                            } else {
                              setNewProduct(prev => ({ 
                                ...prev, 
                                colors: (prev.colors || []).filter(c => c !== color) 
                              }))
                            }
                          }}
                          className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded"
                        />
                        <span className="text-gray-300 text-sm">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Product Images</label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Click to upload images or drag and drop</p>
                    <p className="text-gray-500 text-xs">PNG, JPG up to 5MB each</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingProduct(null)
                    setNewProduct({
                      name: '',
                      description: '',
                      category: '',
                      price: '',
                      originalPrice: '',
                      stock: '',
                      sizes: [],
                      colors: [],
                      images: []
                    })
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductManagement
