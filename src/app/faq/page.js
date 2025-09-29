'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

export default function FAQPage() {
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const faqCategories = [
    {
      title: 'Orders & Shipping',
      faqs: [
        {
          question: 'How can I track my order?',
          answer: 'You can track your order by logging into your account and visiting the "My Orders" section. You\'ll also receive tracking information via email once your order ships. Click on the "Track Package" button to see real-time updates.'
        },
        {
          question: 'What are your shipping options?',
          answer: 'We offer several shipping options: Standard Shipping (5-7 business days, $9.99), Express Shipping (2-3 business days, $19.99), Overnight Shipping (1 business day, $39.99), and Free Shipping (7-10 business days) on orders over $50.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. International orders may be subject to customs duties and taxes, which are the responsibility of the customer.'
        },
        {
          question: 'Can I change or cancel my order?',
          answer: 'Orders can be modified or cancelled within 1 hour of placement. After that, please contact our support team immediately. Once an order has been shipped, it cannot be cancelled, but you can return it according to our return policy.'
        }
      ]
    },
    {
      title: 'Returns & Refunds',
      faqs: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Digital items and personalized products cannot be returned. Return shipping costs are the responsibility of the customer unless the item was defective.'
        },
        {
          question: 'How do I return an item?',
          answer: 'To return an item, log into your account, go to "My Orders", find the order, and click "Return Item". Follow the instructions to print a return label. Pack the item securely and ship it back to us using the provided label.'
        },
        {
          question: 'When will I receive my refund?',
          answer: 'Refunds are processed within 5-7 business days after we receive your returned item. The refund will be credited to your original payment method. Please note that it may take additional time for your bank to process the refund.'
        },
        {
          question: 'Can I exchange an item?',
          answer: 'We don\'t offer direct exchanges. To get a different size or color, please return the original item for a refund and place a new order for the item you want.'
        }
      ]
    },
    {
      title: 'Payment & Pricing',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and other secure payment methods. All transactions are encrypted and secure.'
        },
        {
          question: 'Do you offer price matching?',
          answer: 'We offer price matching on identical items from authorized retailers. The item must be in stock and available for purchase. Contact our customer service team with the competitor\'s price and we\'ll review your request.'
        },
        {
          question: 'Are there any hidden fees?',
          answer: 'No, we believe in transparent pricing. The total you see at checkout is the final amount you\'ll pay. This includes product price, shipping, and applicable taxes. There are no hidden fees or surprise charges.'
        },
        {
          question: 'Do you offer discounts for bulk orders?',
          answer: 'Yes, we offer volume discounts for bulk orders. Please contact our sales team for a custom quote if you\'re ordering large quantities of the same item.'
        }
      ]
    },
    {
      title: 'Account & Technical',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click "Sign Up" in the top right corner of any page. Fill in your information and verify your email address. Having an account allows you to track orders, save items to your wishlist, and checkout faster.'
        },
        {
          question: 'I forgot my password. How do I reset it?',
          answer: 'Click "Sign In" and then "Forgot Password". Enter your email address and we\'ll send you a link to reset your password. If you don\'t receive the email, check your spam folder or contact support.'
        },
        {
          question: 'How do I update my account information?',
          answer: 'Log into your account and go to "My Profile". You can update your personal information, shipping addresses, and payment methods. Make sure to save your changes before leaving the page.'
        },
        {
          question: 'Is my personal information secure?',
          answer: 'Yes, we take your privacy and security seriously. We use industry-standard encryption to protect your personal and payment information. We never share your information with third parties without your consent.'
        }
      ]
    },
    {
      title: 'Products & Inventory',
      faqs: [
        {
          question: 'How do I know if an item is in stock?',
          answer: 'Stock availability is shown on each product page. If an item is out of stock, you\'ll see "Out of Stock" instead of the "Add to Cart" button. You can sign up for notifications to be alerted when the item is back in stock.'
        },
        {
          question: 'Do you restock sold-out items?',
          answer: 'We regularly restock popular items, but availability depends on manufacturer supply. Sign up for restock notifications on the product page to be notified when items become available again.'
        },
        {
          question: 'Are your product photos accurate?',
          answer: 'We strive to show accurate product photos and descriptions. However, colors may appear slightly different due to monitor settings. If you\'re not satisfied with your purchase, you can return it within 30 days.'
        },
        {
          question: 'Do you offer product warranties?',
          answer: 'Many of our products come with manufacturer warranties. Warranty information is listed on the product page when available. We also offer extended warranty options for select electronics and appliances.'
        }
      ]
    }
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about shopping, shipping, returns, and more.
          </p>
        </div>

        {/* Search FAQ */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQ..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.title}</h2>
              
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const itemKey = `${categoryIndex}-${faqIndex}`
                  const isOpen = openItems[itemKey]
                  
                  return (
                    <div key={faqIndex} className="bg-white rounded-lg shadow-sm border">
                      <button
                        onClick={() => toggleItem(itemKey)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-medium text-gray-900 pr-4">{faq.question}</h3>
                        {isOpen ? (
                          <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our customer support team is here to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Contact Support
            </a>
            <a
              href="mailto:support@pixshop.com"
              className="border border-blue-300 text-blue-700 px-8 py-3 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              Email Us
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Order Status</h3>
            <p className="text-gray-600 text-sm mb-3">Check your order status and tracking information</p>
            <a href="/orders" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Track Orders →
            </a>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Returns</h3>
            <p className="text-gray-600 text-sm mb-3">Easy returns within 30 days of purchase</p>
            <a href="/returns" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Return Policy →
            </a>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-3">Get instant help from our support team</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Start Chat →
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
