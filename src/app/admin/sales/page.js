'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'
import {
  FiPlus as PlusIcon,
  FiEdit2 as PencilIcon,
  FiTrash2 as TrashIcon,
  FiEye as EyeIcon,
  FiCalendar as CalendarIcon,
  FiTag as TagIcon,
  FiPercent as PercentIcon
} from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminSalesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingSale, setEditingSale] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    isActive: true,
    minOrderAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    applicableProducts: [],
    applicableCategories: []
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || session.user.userType !== 'admin') {
      router.push('/admin/login')
      return
    }
    fetchSales()
  }, [session, status, router])

  const fetchSales = async () => {
    try {
      setLoading(true)
      
      // Mock data - in real app, this would come from API
      const mockSales = [
        {
          id: 1,
          name: 'Black Friday Sale',
          description: 'Biggest sale of the year',
          discountType: 'percentage',
          discountValue: 25,
          startDate: '2024-11-25',
          endDate: '2024-11-30',
          isActive: true,
          usageCount: 156,
          totalRevenue: 45670.89,
          status: 'active'
        },
        {
          id: 2,
          name: 'Summer Electronics Sale',
          description: 'Special discount on electronics',
          discountType: 'fixed',
          discountValue: 50,
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          isActive: false,
          usageCount: 89,
          totalRevenue: 23450.67,
          status: 'ended'
        },
        {
          id: 3,
          name: 'New Year Clearance',
          description: 'Clear out old inventory',
          discountType: 'percentage',
          discountValue: 40,
          startDate: '2024-01-01',
          endDate: '2024-01-15',
          isActive: false,
          usageCount: 234,
          totalRevenue: 67890.45,
          status: 'ended'
        }
      ]
      
      setSales(mockSales)
    } catch (error) {
      console.error('Failed to fetch sales:', error)
      toast.error('Failed to fetch sales')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.discountValue || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields')
      return
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('End date must be after start date')
      return
    }

    try {
      // In real app, this would be an API call
      toast.success(`Sale ${editingSale ? 'updated' : 'created'} successfully!`)
      setShowCreateModal(false)
      setEditingSale(null)
      resetForm()
      fetchSales()
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(`Failed to ${editingSale ? 'update' : 'create'} sale`)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      startDate: '',
      endDate: '',
      isActive: true,
      minOrderAmount: '',
      maxDiscountAmount: '',
      usageLimit: '',
      applicableProducts: [],
      applicableCategories: []
    })
  }

  const handleEdit = (sale) => {
    setEditingSale(sale)
    setFormData({
      name: sale.name,
      description: sale.description,
      discountType: sale.discountType,
      discountValue: sale.discountValue.toString(),
      startDate: sale.startDate,
      endDate: sale.endDate,
      isActive: sale.isActive,
      minOrderAmount: sale.minOrderAmount?.toString() || '',
      maxDiscountAmount: sale.maxDiscountAmount?.toString() || '',
      usageLimit: sale.usageLimit?.toString() || '',
      applicableProducts: sale.applicableProducts || [],
      applicableCategories: sale.applicableCategories || []
    })
    setShowCreateModal(true)
  }

  const handleDelete = async (saleId) => {
    if (!confirm('Are you sure you want to delete this sale?')) return

    try {
      // In real app, this would be an API call
      toast.success('Sale deleted successfully')
      fetchSales()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete sale')
    }
  }

  const handleToggleStatus = async (saleId, currentStatus) => {
    try {
      // In real app, this would be an API call
      toast.success(`Sale ${currentStatus ? 'deactivated' : 'activated'} successfully`)
      fetchSales()
    } catch (error) {
      console.error('Status toggle error:', error)
      toast.error('Failed to update sale status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'ended':
        return 'bg-gray-100 text-gray-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Special Sales Management</h1>
            <p className="text-gray-600">Create and manage special sales and promotions</p>
          </div>
          <button
            onClick={() => {
              setEditingSale(null)
              resetForm()
              setShowCreateModal(true)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Create Sale</span>
          </button>
        </div>

        {/* Sales Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sales.map((sale) => (
            <div key={sale.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{sale.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                    {sale.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{sale.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Discount:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {sale.discountType === 'percentage' ? `${sale.discountValue}%` : `$${sale.discountValue}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Period:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(sale.startDate).toLocaleDateString()} - {new Date(sale.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Usage:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {sale.usageCount} times
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Revenue:</span>
                    <span className="text-sm font-medium text-green-600">
                      ${sale.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(sale)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleToggleStatus(sale.id, sale.isActive)}
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      sale.isActive 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {sale.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sales.length === 0 && !loading && (
          <div className="text-center py-12">
            <TagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sales created yet</h3>
            <p className="text-gray-600 mb-4">Create your first special sale to boost revenue.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Sale
            </button>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingSale ? 'Edit Sale' : 'Create Special Sale'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sale Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter sale name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type *
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Sale description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.discountValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={formData.discountType === 'percentage' ? '25' : '50.00'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Order Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Discount Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountAmount: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="No limit"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        isActive: e.target.checked 
                      }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingSale ? 'Update Sale' : 'Create Sale'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setEditingSale(null)
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
