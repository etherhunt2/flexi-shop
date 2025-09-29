import Layout from '@/components/Layout'
import Link from 'next/link'
import { 
  ArrowPathIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  TruckIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'

export default function ReturnsPage() {
  const returnSteps = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Log into your account and go to "My Orders" to start a return request.',
      icon: ArrowPathIcon
    },
    {
      step: 2,
      title: 'Print Label',
      description: 'Print the prepaid return shipping label we provide.',
      icon: TruckIcon
    },
    {
      step: 3,
      title: 'Pack & Ship',
      description: 'Pack the item securely and attach the return label.',
      icon: CheckCircleIcon
    },
    {
      step: 4,
      title: 'Get Refund',
      description: 'Receive your refund within 5-7 business days after we receive the item.',
      icon: CreditCardIcon
    }
  ]

  const returnableItems = [
    'Clothing and accessories in original condition with tags',
    'Electronics in original packaging with all accessories',
    'Home and garden items unused and in original packaging',
    'Books and media in sellable condition',
    'Unopened beauty and personal care products'
  ]

  const nonReturnableItems = [
    'Digital downloads and software',
    'Personalized or custom-made items',
    'Perishable goods and food items',
    'Intimate apparel and swimwear',
    'Items damaged by misuse or normal wear',
    'Products without original packaging or tags'
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Exchanges</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We want you to be completely satisfied with your purchase. Learn about our hassle-free return policy.
          </p>
        </div>

        {/* Return Policy Overview */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-12">
          <div className="text-center">
            <ClockIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">30-Day Return Policy</h2>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto">
              You have 30 days from the date of delivery to return most items for a full refund. 
              Items must be in original condition with tags and packaging intact.
            </p>
          </div>
        </div>

        {/* How to Return */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How to Return an Item</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">{step.step}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/orders"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start a Return
            </Link>
          </div>
        </div>

        {/* What Can Be Returned */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Returnable Items</h3>
            </div>
            <ul className="space-y-3">
              {returnableItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Non-Returnable Items</h3>
            </div>
            <ul className="space-y-3">
              {nonReturnableItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Return Conditions */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Conditions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Item Condition Requirements</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Items must be unused and in original condition</li>
                <li>• All original tags and labels must be attached</li>
                <li>• Items must be in original packaging when applicable</li>
                <li>• Include all accessories and documentation</li>
                <li>• No signs of wear, damage, or alteration</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Time Limits</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 30 days from delivery date for most items</li>
                <li>• 14 days for electronics and tech accessories</li>
                <li>• 7 days for perishable or time-sensitive items</li>
                <li>• Holiday purchases: extended return period until January 31st</li>
                <li>• Sale items: same return period as regular items</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Refund Information */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <CreditCardIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Refund Method</h3>
              <p className="text-gray-600 text-sm">
                Refunds are processed to your original payment method
              </p>
            </div>
            
            <div className="text-center">
              <ClockIcon className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Processing Time</h3>
              <p className="text-gray-600 text-sm">
                5-7 business days after we receive your return
              </p>
            </div>
            
            <div className="text-center">
              <TruckIcon className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Return Shipping</h3>
              <p className="text-gray-600 text-sm">
                Free return shipping labels provided for most returns
              </p>
            </div>
          </div>
        </div>

        {/* Exchanges */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Exchanges</h2>
          <p className="text-gray-700 mb-6">
            We don't offer direct exchanges at this time. To get a different size, color, or model, 
            please return the original item for a refund and place a new order for the item you want.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              <strong>Pro Tip:</strong> To ensure you get the item you want, place your new order first, 
              then return the original item. This way, you won't miss out if the new item goes out of stock.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with Your Return?</h2>
          <p className="text-gray-600 mb-6">
            Our customer service team is here to help with any questions about returns or exchanges.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
