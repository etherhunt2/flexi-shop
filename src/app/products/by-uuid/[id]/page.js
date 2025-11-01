'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

// This is a redirection page for backward compatibility
// It will redirect old UUID-based URLs to the new slug-based URLs
export default function ProductLegacyPage() {
    const router = useRouter()
    const params = useParams()

    useEffect(() => {
        const redirectToSlugPage = async () => {
            try {
                // Fetch the product by UUID to get its slug
                const response = await fetch(`/api/products/by-uuid/${params.id}`)
                const data = await response.json()

                if (response.ok && data.slug) {
                    // Redirect to the slug-based URL
                    router.replace(`/products/${data.slug}`)
                } else {
                    // If product not found, redirect to products page
                    router.replace('/products')
                }
            } catch (error) {
                console.error('Error fetching product:', error)
                router.replace('/products')
            }
        }

        if (params.id) {
            redirectToSlugPage()
        }
    }, [params.id, router])

    return null // No need to render anything as we're redirecting
}