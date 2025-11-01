'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'

export default function ProductError({ error, reset }) {
    useEffect(() => {
        console.error('Product page error:', error)
    }, [error])

    return (
        <Layout>
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Something went wrong!
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        We encountered an error while loading the product. Please try again later.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={reset}
                            className="px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            Try again
                        </button>
                        <Link
                            href="/products"
                            className="px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 transition-colors"
                        >
                            Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    )
}