'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import Link from 'next/link'
import {
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

export default function OrderTrackingPage() {
  const params = useParams()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trackingData, setTrackingData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/login?callbackUrl=/orders')
      return
    }

    fetchTrackingData()
  }, [params.id, session, status, router])

  const fetchTrackingData = async () => {
    try {
      setLoading(true)
      // In a real app, you'd fetch actual tracking data from API
      // For now, we'll use mock data
      const mockTrackingData = {
        orderNumber: 'ORD-2024-001',
        trackingNumber: 'TRK123456789',
        carrier: 'FedEx',
        status: 'delivered',
        estimatedDelivery: '2024-01-18',
        actualDelivery: '2024-01-17 14:30',
        shippingAddress: {
          name: 'John Doe',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zip: '10001'
        },
        trackingHistory: [
          {
            date: '2024-01-17 14:30',
            status: 'delivered',
            location: 'New York, NY 10001',
            description: 'Package delivered to recipient',
            completed: true
          },
          {
            date: '2024-01-17 09:15',
            status: 'out_for_delivery',
            location: 'New York, NY',
            description: 'Out for delivery',
            completed: true
          },
          {
            date: '2024-01-16 18:45',
            status: 'in_transit',
            location: 'Newark, NJ',
            description: 'Package arrived at facility',
            completed: true
          },
          {
            date: '2024-01-16 08:30',
            status: 'in_transit',
            location: 'Philadelphia, PA',
            description: 'Package in transit',
            completed: true
          },
          {
            date: '2024-01-15 16:20',
            status: 'shipped',
            location: 'Warehouse, PA',
            description: 'Package shipped from warehouse',
            completed: true
          },
          {
            date: '2024-01-15 10:00',
            status: 'processing',
            location: 'Warehouse, PA',
            description: 'Order processed and ready for shipment',
            completed: true
          }
        ]
      }
      
      setTrackingData(mockTrackingData)
    } catch (error) {
      console.error('Failed to fetch tracking data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status, completed) => {
    if (completed) {
      return <CheckCircleIcon className="w-6 h-6 text-green-500" />
    }
    
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />
      case 'out_for_delivery':
        return <TruckIcon className="w-6 h-6 text-blue-500" />
      case 'in_transit':
        return <TruckIcon className="w-6 h-6 text-yellow-500" />
      case 'shipped':
        return <TruckIcon className="w-6 h-6 text-blue-500" />
      default:
        return <ClockIcon className="w-6 h-6 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600'
      case 'out_for_delivery':
        return 'text-blue-600'
      case 'in_transit':
        return 'text-yellow-600'
      case 'shipped':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!session?.user || !trackingData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tracking Information Not Found</h1>
            <Link
              href="/orders"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Orders
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Package</h1>
          <p className="text-gray-600">Order {trackingData.orderNumber}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tracking Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Tracking Timeline</h2>
              
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-6">
                  {trackingData.trackingHistory.map((event, index) => (
                    <div key={index} className="relative flex items-start">
                      {/* Timeline Dot */}
                      <div className="relative z-10 flex-shrink-0">
                        {getStatusIcon(event.status, event.completed)}
                      </div>
                      
                      {/* Event Content */}
                      <div className="ml-4 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div>
                            <h3 className={`font-medium ${getStatusColor(event.status)}`}>
                              {event.description}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <MapPinIcon className="w-4 h-4 mr-1" />
                              {event.location}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0 text-sm text-gray-500 flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {new Date(event.date).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  {getStatusIcon(trackingData.status, true)}
                </div>
                <h4 className="font-medium text-gray-900 capitalize mb-2">
                  {trackingData.status.replace('_', ' ')}
                </h4>
                {trackingData.actualDelivery ? (
                  <p className="text-sm text-gray-600">
                    Delivered on {new Date(trackingData.actualDelivery).toLocaleString()}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Expected delivery: {new Date(trackingData.estimatedDelivery).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Tracking Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Details</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Tracking Number</p>
                  <p className="text-sm text-gray-900 font-mono">{trackingData.trackingNumber}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Carrier</p>
                  <p className="text-sm text-gray-900">{trackingData.carrier}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Service Type</p>
                  <p className="text-sm text-gray-900">Standard Shipping</p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
              
              <div className="text-sm text-gray-900">
                <p className="font-medium">{trackingData.shippingAddress.name}</p>
                <p>{trackingData.shippingAddress.address}</p>
                <p>
                  {trackingData.shippingAddress.city}, {trackingData.shippingAddress.state} {trackingData.shippingAddress.zip}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              
              <div className="space-y-3">
                <Link
                  href={`/orders/${params.id}`}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
                >
                  View Order Details
                </Link>
                
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Download Tracking Info
                </button>
                
                <Link
                  href="/contact"
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center block"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Instructions */}
        {trackingData.status === 'delivered' && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Package Delivered Successfully</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Your package was delivered on {new Date(trackingData.actualDelivery).toLocaleString()}.
                    If you have any issues with your order, please contact our support team.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href="/contact"
                    className="text-sm font-medium text-green-600 hover:text-green-500"
                  >
                    Report an issue →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Tracking Tips</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• Tracking information is updated every few hours</p>
            <p>• Delivery times may vary due to weather or other factors</p>
            <p>• You'll receive email notifications for major status updates</p>
            <p>• Contact us if tracking hasn't updated in 24+ hours</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
