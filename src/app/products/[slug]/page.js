'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, ShoppingCartIcon, HeartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
    const params = useParams()
    const { data: session } = useSession()
    const [product, setProduct] = useState(null)
    const [relatedProducts, setRelatedProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)
    const [activeTab, setActiveTab] = useState('description')

    const { addToCart } = useCart()
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

    const fetchProduct = useCallback(async () => {
        try {
            setLoading(true)
            console.log('Fetching product with slug:', params.slug)
            const response = await fetch(`/api/products/slug/${params.slug}`)

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Product not found')
                }
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to load product')
            }

            const data = await response.json()
            console.log('Product data:', data)

            // Update state only if component is still mounted
            setProduct(data)
            setRelatedProducts(data.relatedProducts || [])
        } catch (error) {
            console.error('Failed to fetch product:', error)
            toast.error(error.message || 'Failed to load product details')
            // Re-throw the error so Next.js error boundary can catch it
            throw error
        } finally {
            setLoading(false)
        }
    }, [params.slug])

    useEffect(() => {
        if (params.slug) {
            fetchProduct()
        }
    }, [fetchProduct])

    const handleAddToCart = () => {
        addToCart(product.id, quantity)
        toast.success('Added to cart successfully!')
    }

    const handleWishlistToggle = () => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id)
            toast.success('Removed from wishlist!')
        } else {
            addToWishlist(product.id)
            toast.success('Added to wishlist!')
        }
    }

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change
        if (newQuantity >= 1 && newQuantity <= product.quantity) {
            setQuantity(newQuantity)
        }
    }

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
                            <div className="space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-20 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }

    if (!product) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                        <p className="text-gray-600 mb-8">Sorry, we couldn't find the product you're looking for.</p>
                        <Link
                            href="/products"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            ← Back to Products
                        </Link>
                    </div>
                </div>
            </Layout>
        )
    }

    const images = product.images && product.images.length > 0
        ? product.images.map(img => img.image)
        : [product.mainImage || '/placeholder-product.svg']

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                    <Link href="/" className="hover:text-gray-900">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-gray-900">Products</Link>
                    <span>/</span>
                    <span className="text-gray-900">{product.name}</span>
                </nav>

                {/* Product Detail Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="relative aspect-square overflow-hidden rounded-lg border">
                            <Image
                                src={images[selectedImage]}
                                alt={product.name}
                                width={600}
                                height={600}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative aspect-square rounded-md border overflow-hidden ${selectedImage === index ? 'ring-2 ring-blue-500' : ''
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            width={150}
                                            height={150}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.averageRating || 0)
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                    <span className="ml-2 text-sm text-gray-600">
                                        ({product.reviewCount} reviews)
                                    </span>
                                </div>
                                <span className="text-sm text-gray-600">Brand:
                                    <Link href={`/brands/${product.brand?.slug}`} className="ml-1 text-blue-600 hover:underline">
                                        {product.brand?.name}
                                    </Link>
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-gray-900">
                                    ${product.discountedPrice || product.price}
                                </span>
                                {product.discountedPrice && (
                                    <span className="text-xl text-gray-500 line-through">
                                        ${product.price}
                                    </span>
                                )}
                            </div>
                            {product.discountedPrice && (
                                <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                                    Save ${(product.price - product.discountedPrice).toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div>
                            {product.quantity > 0 ? (
                                <span className="text-green-600 font-medium">
                                    ✓ In Stock ({product.quantity} available)
                                </span>
                            ) : (
                                <span className="text-red-600 font-medium">
                                    ✕ Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Quantity Selector and Add to Cart */}
                        {product.quantity > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-700">Quantity:</span>
                                    <div className="flex items-center border rounded-md">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            className="p-2 hover:bg-gray-100"
                                            disabled={quantity <= 1}
                                        >
                                            <MinusIcon className="w-4 h-4" />
                                        </button>
                                        <span className="px-4 py-2 text-center min-w-[3rem]">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            className="p-2 hover:bg-gray-100"
                                            disabled={quantity >= product.quantity}
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCartIcon className="w-5 h-5" />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={handleWishlistToggle}
                                        className="px-6 py-3 rounded-md border hover:bg-gray-50"
                                    >
                                        {isInWishlist(product.id) ? (
                                            <HeartIcon className="w-5 h-5 text-red-500" />
                                        ) : (
                                            <HeartOutlineIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Categories */}
                        {product.categories?.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-gray-700">Categories:</span>
                                <div className="flex flex-wrap gap-2">
                                    {product.categories.map(category => (
                                        <Link
                                            key={category.id}
                                            href={`/categories/${category.slug}`}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mb-12">
                    <div className="border-b">
                        <nav className="flex space-x-8">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`py-4 text-sm font-medium border-b-2 ${activeTab === 'description'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Description
                            </button>
                            <button
                                onClick={() => setActiveTab('specification')}
                                className={`py-4 text-sm font-medium border-b-2 ${activeTab === 'specification'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Specifications
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`py-4 text-sm font-medium border-b-2 ${activeTab === 'reviews'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Reviews ({product.reviewCount})
                            </button>
                        </nav>
                    </div>

                    <div className="py-6">
                        {activeTab === 'description' && (
                            <div className="prose max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }} />
                                {product.extraDescriptions && Object.entries(product.extraDescriptions).map(([title, content]) => (
                                    <div key={title} className="mt-6">
                                        <h3 className="text-lg font-semibold mb-2">{title}</h3>
                                        <div dangerouslySetInnerHTML={{ __html: content }} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'specification' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {product.specification ? (
                                    Object.entries(product.specification).map(([key, value]) => (
                                        <div key={key} className="border-b pb-4">
                                            <dt className="text-sm font-medium text-gray-500">{key}</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No specifications available.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-8">
                                {/* Review Submission Form for Authenticated Users */}
                                {session?.user && (
                                    <div className="bg-gray-50 p-6 rounded-lg mb-8">
                                        <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                                        <form onSubmit={async (e) => {
                                            e.preventDefault()
                                            const formData = new FormData(e.target)
                                            const rating = parseInt(formData.get('rating'))
                                            const reviewText = formData.get('review')

                                            if (!rating || !reviewText) {
                                                toast.error('Please provide both rating and review text')
                                                return
                                            }

                                            try {
                                                const response = await fetch('/api/products/reviews', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify({
                                                        productId: product.id,
                                                        rating,
                                                        review: reviewText
                                                    }),
                                                })

                                                if (!response.ok) {
                                                    throw new Error('Failed to submit review')
                                                }

                                                toast.success('Review submitted successfully!')
                                                // Refresh the product data to show the new review
                                                fetchProduct()
                                                // Reset the form
                                                e.target.reset()
                                            } catch (error) {
                                                toast.error('Failed to submit review: ' + error.message)
                                            }
                                        }} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Rating
                                                </label>
                                                <div className="flex gap-2">
                                                    {[5, 4, 3, 2, 1].map((value) => (
                                                        <label key={value} className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="rating"
                                                                value={value}
                                                                className="sr-only peer"
                                                            />
                                                            <StarIcon className="w-8 h-8 cursor-pointer transition-colors peer-checked:text-yellow-400 hover:text-yellow-400 text-gray-300" />
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Your Review
                                                </label>
                                                <textarea
                                                    name="review"
                                                    id="review"
                                                    rows="4"
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="Write your review here..."
                                                    required
                                                ></textarea>
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Submit Review
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* Message for Non-authenticated Users */}
                                {!session?.user && (
                                    <div className="bg-blue-50 text-blue-700 p-4 rounded-md mb-8">
                                        <p>Please <Link href="/auth/login" className="underline font-medium">sign in</Link> to write a review.</p>
                                    </div>
                                )}

                                {/* Existing Reviews */}
                                <div className="divide-y">
                                    {product.reviews?.length > 0 ? (
                                        product.reviews.map((review) => (
                                            <div key={review.id} className="py-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <StarIcon
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="ml-2 text-sm text-gray-600">
                                                            by {review.user.name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600">{review.review}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 py-4">No reviews yet. Be the first to review this product!</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.slice(0, 4).map((relatedProduct) => (
                                <div key={relatedProduct.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border">
                                    <Link href={`/products/${relatedProduct.slug}`}>
                                        <div className="relative overflow-hidden rounded-t-lg">
                                            <Image
                                                src={relatedProduct.mainImage || '/placeholder-product.svg'}
                                                alt={relatedProduct.name}
                                                width={300}
                                                height={300}
                                                className="w-full h-48 object-cover hover:scale-105 transition-transform"
                                            />
                                        </div>
                                    </Link>
                                    <div className="p-4">
                                        <Link href={`/products/${relatedProduct.slug}`}>
                                            <h3 className="font-medium text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                                                {relatedProduct.name}
                                            </h3>
                                        </Link>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-gray-900">
                                                ${relatedProduct.discountedPrice || relatedProduct.price}
                                            </span>
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(relatedProduct.averageRating || 0)
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}