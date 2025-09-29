'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  FiHome as HomeIcon,
  FiShoppingBag as ShoppingBagIcon,
  FiFolder as FolderIcon,
  FiTag as TagIcon,
  FiUsers as UsersIcon,
  FiBarChart2 as PresentationChartBarIcon,
  FiSettings as CogIcon,
  FiBell as BellIcon,
  FiUser as UserCircleIcon,
  FiLogOut as ArrowRightOnRectangleIcon,
  FiMenu as Bars3Icon,
  FiX as XMarkIcon,
  FiShoppingCart as ShoppingCartIcon,
  FiGift as GiftIcon,
  FiChevronRight as ChevronDownIcon
} from 'react-icons/fi'

export default function AdminLayout({ children }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { 
      name: 'Products', 
      icon: ShoppingBagIcon,
      children: [
        { name: 'All Products', href: '/admin/products' },
        { name: 'Add Product', href: '/admin/products/create' },
        { name: 'Product Reviews', href: '/admin/products/reviews' },
        { name: 'Stock Management', href: '/admin/products/stock' }
      ]
    },
    { 
      name: 'Categories', 
      icon: FolderIcon,
      children: [
        { name: 'All Categories', href: '/admin/categories' },
        { name: 'Add Category', href: '/admin/categories/create' }
      ]
    },
    { 
      name: 'Brands', 
      icon: TagIcon,
      children: [
        { name: 'All Brands', href: '/admin/brands' },
        { name: 'Add Brand', href: '/admin/brands/create' }
      ]
    },
    { 
      name: 'Users', 
      icon: UsersIcon,
      children: [
        { name: 'All Users', href: '/admin/users' },
        { name: 'Add User', href: '/admin/users/create' },
        { name: 'User Activities', href: '/admin/users/activity' }
      ]
    },
    { 
      name: 'Orders', 
      icon: ShoppingCartIcon,
      children: [
        { name: 'All Orders', href: '/admin/orders' },
        { name: 'Pending Orders', href: '/admin/orders/pending' },
        { name: 'Processing Orders', href: '/admin/orders/processing' },
        { name: 'Shipped Orders', href: '/admin/orders/shipped' },
        { name: 'Delivered Orders', href: '/admin/orders/delivered' }
      ]
    },
    { 
      name: 'Sales & Offers', 
      icon: GiftIcon,
      children: [
        { name: 'Special Sales', href: '/admin/sales' },
        { name: 'Create Sale', href: '/admin/sales/create' },
        { name: 'Coupons', href: '/admin/coupons' },
        { name: 'Offers', href: '/admin/offers' }
      ]
    },
    { name: 'Sales Reports', href: '/admin/reports', icon: PresentationChartBarIcon },
    { 
      name: 'Settings', 
      icon: CogIcon,
      children: [
        { name: 'General Settings', href: '/admin/settings' },
        { name: 'Payment Settings', href: '/admin/settings/payment' },
        { name: 'Shipping Settings', href: '/admin/settings/shipping' },
        { name: 'Email Settings', href: '/admin/settings/email' }
      ]
    }
  ]

  const handleSignOut = () => {
    signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600 flex-shrink-0">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">P</span>
            </div>
            <span className="text-white font-bold text-xl">Admin Panel</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} pathname={pathname} />
          ))}
        </nav>

        {/* User info at bottom */}
        <div className="flex-shrink-0 p-4 bg-gray-50 border-t">
          <div className="flex items-center space-x-3">
            <UserCircleIcon className="w-8 h-8 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session?.user?.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session?.user?.email || 'admin@pixshop.com'}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-gray-400 hover:text-gray-600"
              title="Sign out"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4 ml-auto">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function NavItem({ item, pathname }) {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isActive = pathname === item.href || (hasChildren && item.children.some(child => pathname === child.href))

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isActive 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </div>
          <svg
            className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="ml-6 mt-2 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.name}
                href={child.href}
                className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                  pathname === child.href
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <item.icon className="w-5 h-5" />
      <span>{item.name}</span>
    </Link>
  )
}
