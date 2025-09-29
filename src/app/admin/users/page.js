'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import {
  FiSearch as MagnifyingGlassIcon,
  FiEdit2 as PencilIcon,
  FiEye as EyeIcon,
  FiUserPlus as UserPlusIcon,
  FiFilter as FunnelIcon
} from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    verification: ''
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || session.user.userType !== 'admin') {
      router.push('/admin/login')
      return
    }
    fetchUsers()
  }, [session, status, router, filters])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      // Mock data - in real app, this would come from API
      const mockUsers = [
        {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          username: 'johndoe',
          email: 'john@example.com',
          mobile: '+1234567890',
          status: 1,
          ev: 1, // email verified
          sv: 1, // sms verified
          balance: 150.75,
          totalOrders: 12,
          totalSpent: 1245.67,
          created_at: '2024-01-15',
          last_login: '2024-01-20'
        },
        {
          id: 2,
          firstname: 'Jane',
          lastname: 'Smith',
          username: 'janesmith',
          email: 'jane@example.com',
          mobile: '+1987654321',
          status: 1,
          ev: 1,
          sv: 0,
          balance: 0,
          totalOrders: 5,
          totalSpent: 567.89,
          created_at: '2024-01-10',
          last_login: '2024-01-19'
        },
        {
          id: 3,
          firstname: 'Bob',
          lastname: 'Johnson',
          username: 'bobjohnson',
          email: 'bob@example.com',
          mobile: '+1122334455',
          status: 0, // banned
          ev: 0,
          sv: 0,
          balance: 25.50,
          totalOrders: 2,
          totalSpent: 89.99,
          created_at: '2024-01-05',
          last_login: '2024-01-18'
        }
      ]
      
      setUsers(mockUsers)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      // In real app, this would be an API call
      toast.success(`User ${currentStatus === 1 ? 'banned' : 'activated'} successfully`)
      fetchUsers()
    } catch (error) {
      console.error('Status toggle error:', error)
      toast.error('Failed to update user status')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstname.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.lastname.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.username.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesStatus = filters.status === '' || user.status.toString() === filters.status
    
    const matchesVerification = 
      filters.verification === '' ||
      (filters.verification === 'verified' && user.ev === 1 && user.sv === 1) ||
      (filters.verification === 'email_only' && user.ev === 1 && user.sv === 0) ||
      (filters.verification === 'unverified' && user.ev === 0)

    return matchesSearch && matchesStatus && matchesVerification
  })

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
            <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
            <p className="text-gray-600">Manage customer accounts and user data</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 1).length}
              </p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {users.filter(u => u.ev === 1 && u.sv === 1).length}
              </p>
              <p className="text-sm text-gray-600">Fully Verified</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {users.filter(u => u.status === 0).length}
              </p>
              <p className="text-sm text-gray-600">Banned Users</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Users</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="1">Active</option>
                <option value="0">Banned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification</label>
              <select
                value={filters.verification}
                onChange={(e) => setFilters(prev => ({ ...prev, verification: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Verification</option>
                <option value="verified">Fully Verified</option>
                <option value="email_only">Email Only</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ search: '', status: '', verification: '' })}
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstname} {user.lastname}
                          </div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.mobile}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.ev === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.ev === 1 ? 'Email ✓' : 'Email ✗'}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.sv === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.sv === 1 ? 'SMS ✓' : 'SMS ✗'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${user.balance.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.totalOrders} orders
                      </div>
                      <div className="text-sm text-gray-500">
                        ${user.totalSpent.toFixed(2)} spent
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(user.id, user.status)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 1 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {user.status === 1 ? 'Active' : 'Banned'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Edit User"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-12">
              <UserPlusIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">
                {filters.search || filters.status || filters.verification
                  ? 'Try adjusting your search criteria.'
                  : 'Users will appear here once they register.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
