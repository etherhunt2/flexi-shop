'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/Layout'

function ErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    const getErrorMessage = (error) => {
        switch (error) {
            case 'Configuration':
                return 'There is a problem with the server configuration. Please try again later.'
            case 'AccessDenied':
                return 'Access denied. You do not have permission to access this resource.'
            case 'Verification':
                return 'The verification failed. Please try again.'
            case 'CredentialsSignin':
                return 'Invalid email or password. Please check your credentials and try again.'
            default:
                return 'An unexpected error occurred. Please try again.'
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Authentication Error
                    </h2>
                    <div className="mt-4 p-4 rounded-md bg-red-50">
                        <p className="text-sm text-red-700">
                            {getErrorMessage(error)}
                        </p>
                    </div>
                    <div className="mt-6 flex justify-center gap-4">
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Back to Login
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Go to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AuthError() {
    return (
        <Layout>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            }>
                <ErrorContent />
            </Suspense>
        </Layout>
    )
}