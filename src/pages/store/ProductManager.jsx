import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload, 
  Eye, 
  Package,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Loader
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'
import ProductAPI from '../../services/ProductAPI'

const ProductManager = () => {
  const { user, isOwner } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'clothing',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White'],
    images: [],
    stock: '',
    tags: '',
    status: 'active'
  })

  const categories = [
    'clothing',
    'accessories', 
    'footwear',
    'premium',
    'limited-edition'
  ]

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL']
  const colorOptions = ['Black', 'White', 'Gray', 'Navy', 'Red', 'Blue', 'Green', 'Purple', 'Pink', 'Yellow', 'Orange']

  useEffect(() => {
    if (isOwner) {
      fetchProducts()
    }
  }, [isOwner])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await ProductAPI.getAllProductsForManagement()
      if (response.success) {
        setProducts(response.data)
      } else {
        toast.error(response.message || 'Failed to fetch products')
      }
    } catch (error) {
      toast.error('Failed to fetch products')
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleArrayChange = (field, values) => {
    setFormData(prev => ({
      ...prev,
      [field]: values
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    // For now, we'll just store the file names
    // Later implement actual image upload to your backend/cloud storage
    const imageUrls = files.map(file => URL.createObjectURL(file))
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }))
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        tags: formData.tags.split(',').map(tag => tag.trim())
      }

      let response
      if (editingProduct) {
        // Update existing product
        response = await ProductAPI.updateProduct(editingProduct.id, productData)
        toast.success('Product updated successfully!')
      } else {
        // Create new product
        response = await ProductAPI.createProduct(productData)
        toast.success('Product created successfully!')
      }

      if (response.success) {
        resetForm()
        fetchProducts()
      } else {
        toast.error(response.message || 'Failed to save product')
      }
    } catch (error) {
      toast.error('Failed to save product')
      console.error('Error saving product:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'clothing',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White'],
      images: [],
      stock: '',
      tags: '',
      status: 'active'
    })
    setEditingProduct(null)
    setShowAddForm(false)
  }

  const editProduct = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      images: product.images,
      stock: product.stock.toString(),
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : product.tags,
      status: product.status
    })
    setEditingProduct(product)
    setShowAddForm(true)
  }

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await ProductAPI.deleteProduct(productId)
        if (response.success) {
          toast.success('Product deleted successfully!')
          fetchProducts()
        } else {
          toast.error(response.message || 'Failed to delete product')
        }
      } catch (error) {
        toast.error('Failed to delete product')
        console.error('Error deleting product:', error)
      }
    }
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Only the store owner can manage products.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Package className="mr-3 text-purple-600" />
                MaRk7Raw Store Manager
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your premium fashion collection
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <Plus className="mr-2" size={20} />
              Add New Product
            </button>
          </div>
        </div>

        {/* Product Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Product Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                          placeholder="e.g., MaRk7Raw Signature Tee"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Describe your product..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Price (R)
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                            placeholder="299.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Stock Quantity
                          </label>
                          <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            required
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                            placeholder="50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Variants and Images */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Available Sizes
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {sizeOptions.map(size => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => {
                                const newSizes = formData.sizes.includes(size)
                                  ? formData.sizes.filter(s => s !== size)
                                  : [...formData.sizes, size]
                                handleArrayChange('sizes', newSizes)
                              }}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                formData.sizes.includes(size)
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Available Colors
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {colorOptions.map(color => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => {
                                const newColors = formData.colors.includes(color)
                                  ? formData.colors.filter(c => c !== color)
                                  : [...formData.colors, color]
                                handleArrayChange('colors', newColors)
                              }}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                formData.colors.includes(color)
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Product Images
                        </label>
                        <div className="space-y-4">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                          />
                          
                          {formData.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                              {formData.images.map((image, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={image}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          name="tags"
                          value={formData.tags}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                          placeholder="signature, premium, cotton, limited"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center"
                    >
                      {loading ? (
                        <Loader className="animate-spin mr-2" size={16} />
                      ) : (
                        <Save className="mr-2" size={16} />
                      )}
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Products</h3>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin h-8 w-8 text-purple-600" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No products yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating your first product.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="aspect-w-1 aspect-h-1 w-full">
                    <img
                      src={product.images[0] || 'https://via.placeholder.com/400x400/7c3aed/ffffff?text=Product'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">{product.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{product.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xl font-bold text-purple-600">R {product.price}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Stock: {product.stock}</span>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => editProduct(product)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductManager
