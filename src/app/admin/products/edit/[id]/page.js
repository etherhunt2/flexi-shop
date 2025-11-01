'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'
import { FiArrowLeft as ArrowLeftIcon, FiPlus as PlusIcon, FiX as XMarkIcon } from 'react-icons/fi'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import { fetcher } from '@/lib/api-fetcher'

export default function EditProductPage({ params }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        summary: '',
        description: '',
        price: '',
        discountedPrice: '',
        quantity: '',
        brandId: '',
        categoryIds: [],
        isFeatured: false,
        isSlider: false,
        status: 1,
        digitalItem: false,
        mainImage: '',
        images: [],
        specification: {},
        metaTitle: '',
        metaDescription: '',
        metaKeywords: ''
    })

    // Unwrap params using React.use()
    const { id } = use(params)

    // Fetch product data using SWR
    const { data: product, error: productError } = useSWR(
        session?.user?.userType === 'admin' ? `/api/admin/products/by-uuid/${id}` : null,
        fetcher,
        {
            onError: (error) => {
                console.error('Product fetch error:', error)
                toast.error(error.info?.error || 'Failed to load product')
            }
        }
    )

    // Fetch categories
    const { data: categories = [] } = useSWR(
        session?.user?.userType === 'admin' ? '/api/categories' : null,
        fetcher,
        {
            onError: (error) => {
                console.error('Categories fetch error:', error)
                toast.error('Failed to load categories')
            }
        }
    )

    // Fetch brands
    const { data: brands = [] } = useSWR(
        session?.user?.userType === 'admin' ? '/api/brands' : null,
        fetcher,
        {
            onError: (error) => {
                console.error('Brands fetch error:', error)
                toast.error('Failed to load brands')
            }
        }
    )

    // Redirect if not admin
    useEffect(() => {
        if (status === 'loading') return
        if (!session?.user || session.user.userType !== 'admin') {
            router.push('/admin/login')
        }
    }, [session, status, router])

    // Set form data when product data is loaded
    useEffect(() => {
        if (!product) return

        setFormData({
            name: product.name || '',
            slug: product.slug || '',
            summary: product.short_description || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            discountedPrice: product.discountedPrice?.toString() || '',
            quantity: product.stock?.[0]?.quantity?.toString() || '',
            brandId: product.brandId || '',
            categoryIds: product.categories?.map(c => c.id) || [],
            isFeatured: product.is_featured === 1,
            isSlider: product.is_slider === 1,
            status: product.status || 1,
            digitalItem: product.digital_item === 1,
            mainImage: product.main_image || '',
            images: product.images || [],
            specification: product.specification || {},
            metaTitle: product.meta_title || '',
            metaDescription: product.meta_description || '',
            metaKeywords: Array.isArray(product.meta_keywords) ? product.meta_keywords.join(', ') : String(product.meta_keywords || '')
        })
    }, [product])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))

        // Auto-generate slug from name if slug is empty or matches the old name-based slug
        if (name === 'name' && (!formData.slug || formData.slug === formData.name?.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim())) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()
            setFormData(prev => ({ ...prev, slug }))
        }
    }

    const handleCategoryChange = (categoryId) => {
        setFormData(prev => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter(id => id !== categoryId)
                : [...prev.categoryIds, categoryId]
        }))
    }

    const handleSpecificationChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            specification: {
                ...prev.specification,
                [key]: value
            }
        }))
    }

    const addSpecification = () => {
        const key = prompt('Enter specification name:')
        if (key) {
            handleSpecificationChange(key, '')
        }
    }

    const removeSpecification = (key) => {
        setFormData(prev => {
            const newSpec = { ...prev.specification }
            delete newSpec[key]
            return { ...prev, specification: newSpec }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name || !formData.price || !formData.brandId || formData.categoryIds.length === 0) {
            toast.error('Please fill in all required fields')
            return
        }

        setLoading(true)

        try {
            const response = await fetch(`/api/admin/products/by-uuid/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : null,
                    quantity: parseInt(formData.quantity) || 0,
                    brandId: formData.brandId,
                    categoryIds: formData.categoryIds
                }),
            })

            if (response.ok) {
                toast.success('Product updated successfully!')
                router.push('/admin/products')
            } else {
                const errorData = await response.json()
                toast.error(errorData.error || 'Failed to update product')
            }
        } catch (error) {
            console.error('Update error:', error)
            toast.error('Failed to update product')
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading' || !product) {
        return (
            <AdminLayout>
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/products"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                        <p className="text-gray-600">Update product information</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Featured Image Upload */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="mainImage" className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            {formData.mainImage ? (
                                                <>
                                                    <img
                                                        src={formData.mainImage}
                                                        alt="Featured"
                                                        className="absolute inset-0 w-full h-full object-contain"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                        <span className="text-white">Change Image</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                    <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 800x400px)</p>
                                                </div>
                                            )}
                                            <input
                                                id="mainImage"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0]
                                                    if (file) {
                                                        const formData = new FormData()
                                                        formData.append('file', file)

                                                        try {
                                                            const response = await fetch('/api/admin/upload', {
                                                                method: 'POST',
                                                                body: formData
                                                            })

                                                            if (response.ok) {
                                                                const data = await response.json()
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    mainImage: data.url
                                                                }))
                                                                toast.success('Image uploaded successfully')
                                                            } else {
                                                                throw new Error('Failed to upload image')
                                                            }
                                                        } catch (error) {
                                                            console.error('Upload error:', error)
                                                            toast.error('Failed to upload image')
                                                        }
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                    {formData.mainImage && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, mainImage: '' }))}
                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                        >
                                            Remove Image
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter product name"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Slug
                                        </label>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="product-slug"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Price *
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            required
                                            step="0.01"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Discounted Price
                                        </label>
                                        <input
                                            type="number"
                                            name="discountedPrice"
                                            step="0.01"
                                            value={formData.discountedPrice}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Brand *
                                        </label>
                                        <select
                                            name="brandId"
                                            required
                                            value={formData.brandId}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Brand</option>
                                            {brands.map((brand) => (
                                                <option key={brand.id} value={brand.id}>
                                                    {brand.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Short Description
                                        </label>
                                        <textarea
                                            name="summary"
                                            rows={3}
                                            value={formData.summary}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Brief product description"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Description
                                        </label>
                                        <textarea
                                            name="description"
                                            rows={6}
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Detailed product description"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories *</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {categories.map((category) => (
                                        <label key={category.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.categoryIds.includes(category.id)}
                                                onChange={() => handleCategoryChange(category.id)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="text-sm text-gray-700">{category.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Specifications */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
                                    <button
                                        type="button"
                                        onClick={addSpecification}
                                        className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-1"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        <span>Add</span>
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {Object.entries(formData.specification).map(([key, value]) => (
                                        <div key={key} className="flex items-center space-x-3">
                                            <div className="flex-1 grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    value={key}
                                                    onChange={(e) => {
                                                        const newSpec = { ...formData.specification }
                                                        delete newSpec[key]
                                                        newSpec[e.target.value] = value
                                                        setFormData(prev => ({ ...prev, specification: newSpec }))
                                                    }}
                                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Specification name"
                                                />
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => handleSpecificationChange(key, e.target.value)}
                                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Specification value"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSpecification(key)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <XMarkIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Product Options */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Options</h2>

                                <div className="space-y-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="isFeatured"
                                            checked={formData.isFeatured}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">Featured Product</span>
                                    </label>

                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="isSlider"
                                            checked={formData.isSlider}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">Slider Product</span>
                                    </label>

                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="digitalItem"
                                            checked={formData.digitalItem}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">Digital Product</span>
                                    </label>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* SEO */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Meta Title
                                        </label>
                                        <input
                                            type="text"
                                            name="metaTitle"
                                            value={formData.metaTitle}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="SEO title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Meta Description
                                        </label>
                                        <textarea
                                            name="metaDescription"
                                            rows={3}
                                            value={formData.metaDescription}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="SEO description"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Meta Keywords
                                        </label>
                                        <input
                                            type="text"
                                            name="metaKeywords"
                                            value={formData.metaKeywords}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="keyword1, keyword2, keyword3"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="space-y-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {loading ? 'Updating...' : 'Update Product'}
                                    </button>

                                    <Link
                                        href="/admin/products"
                                        className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center block"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}