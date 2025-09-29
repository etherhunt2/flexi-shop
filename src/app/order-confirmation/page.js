'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { CheckCircleIcon, TruckIcon, EnvelopeIcon, PrinterIcon } from '@heroicons/react/24/solid'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    const order = searchParams.get('order')
    if (order) {
      setOrderNumber(order)
    }
  }, [searchParams])

  const mockOrderDetails = {
    orderNumber: orderNumber || 'ORD-1234567890',
    orderDate: new Date().toLocaleDateString(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    total: '$299.97',
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    items: [
      {
        id: 1,
        name: 'iPhone 15 Pro',
        quantity: 1,
        price: '$899.00'
      },
      {
        id: 2,
        name: 'Nike Air Max 270',
        quantity: 2,
        price: '$150.00'
      }
    ]
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Order #{mockOrderDetails.orderNumber}
                </h2>
                <p className="text-gray-600">Placed on {mockOrderDetails.orderDate}</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <PrinterIcon className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>Email Receipt</span>
                </button>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <p className="font-medium text-green-800">Order Confirmed</p>
                  <p className="text-sm text-green-600">
                    We've received your order and will begin processing it shortly.
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <TruckIcon className="w-5 h-5 mr-2" />
                  Delivery Information
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Estimated Delivery:</strong> {mockOrderDetails.estimatedDelivery}</p>
                  <p><strong>Shipping Method:</strong> Standard Shipping</p>
                  <p><strong>Tracking:</strong> Available once shipped</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{mockOrderDetails.shippingAddress.name}</p>
                  <p>{mockOrderDetails.shippingAddress.address}</p>
                  <p>
                    {mockOrderDetails.shippingAddress.city}, {mockOrderDetails.shippingAddress.state} {mockOrderDetails.shippingAddress.zip}
                  </p>
                  <p>{mockOrderDetails.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {mockOrderDetails.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-gray-900">{item.price}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>{mockOrderDetails.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">Order Processing</p>
                  <p className="text-blue-600">We'll prepare your items for shipment (1-2 business days)</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">Shipment</p>
                  <p className="text-blue-600">Your order will be shipped and you'll receive tracking information</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">Delivery</p>
                  <p className="text-blue-600">Your package will arrive at your doorstep</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
            >
              Continue Shopping
            </Link>
            <Link
              href="/orders"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
            >
              View All Orders
            </Link>
          </div>

          {/* Support Information */}
          <div className="mt-12 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about your order, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Contact Support
              </Link>
              <span className="hidden sm:inline text-gray-300">|</span>
              <Link
                href="/faq"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                FAQ
              </Link>
              <span className="hidden sm:inline text-gray-300">|</span>
              <Link
                href="/returns"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Return Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}
