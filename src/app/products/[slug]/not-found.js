'use client'

import Link from 'next/link'
import Layout from '@/components/Layout'

export default function ProductNotFound() {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Sorry, we couldn't find the product you're looking for. It may have been removed or the URL might be incorrect.
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        ← Browse All Products
                    </Link>
                </div>
            </div>
        </Layout>
    )
}