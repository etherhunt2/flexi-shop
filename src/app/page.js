'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import FloatingIcon from '@/components/ui/FloatingIcon'
import GlowingCard from '@/components/ui/GlowingCard'
import GradientText from '@/components/ui/GradientText'
import PulseButton from '@/components/ui/PulseButton'
import CategoryCard from '@/components/ui/CategoryCard'
import ProductCard from '@/components/ui/ProductCard'
import BrandCard from '@/components/ui/BrandCard'
import FeatureCard from '@/components/ui/FeatureCard'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          fetch('/api/products?limit=8&featured=true'),
          fetch('/api/categories?includeProducts=false'),
          fetch('/api/brands?isTop=true')
        ])

        const [productsData, categoriesData, brandsData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
          brandsRes.json()
        ])

        setFeaturedProducts(productsData.products || [])
        setCategories(categoriesData.slice(0, 8) || [])
        setBrands(brandsData.slice(0, 12) || [])
      } catch (error) {
        console.error('Failed to fetch home data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  const handleAddToCart = (productId) => {
    addToCart(productId, 1)
  }

  const handleWishlistToggle = (productId) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId)
    } else {
      addToWishlist(productId)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
        <AnimatedBackground />
        
        {/* Floating 3D Icons */}
        <FloatingIcon 
          icon={<Image src="/icons/shopping-bag-3d.svg" alt="Shopping" width={80} height={80} className="animate-glow" />}
          className="top-20 left-10 hidden lg:block"
          delay={0}
          amplitude={25}
          duration={4}
        />
        <FloatingIcon 
          icon={<Image src="/icons/gift-box-3d.svg" alt="Gift" width={60} height={60} className="animate-glow" />}
          className="top-32 right-16 hidden lg:block"
          delay={1}
          amplitude={20}
          duration={3.5}
        />
        <FloatingIcon 
          icon={<Image src="/icons/lightning-3d.svg" alt="Fast" width={50} height={50} className="animate-glow" />}
          className="bottom-32 left-20 hidden lg:block"
          delay={2}
          amplitude={30}
          duration={5}
        />
        <FloatingIcon 
          icon={<Image src="/icons/star-3d.svg" alt="Quality" width={45} height={45} className="animate-glow" />}
          className="top-1/3 right-32 hidden lg:block"
          delay={0.5}
          amplitude={15}
          duration={4.5}
        />
        <FloatingIcon 
          icon={<Image src="/icons/heart-3d.svg" alt="Love" width={40} height={40} className="animate-glow" />}
          className="bottom-20 right-10 hidden lg:block"
          delay={1.5}
          amplitude={22}
          duration={3.8}
        />
        <FloatingIcon 
          icon={<Image src="/icons/diamond-3d.svg" alt="Premium" width={35} height={35} className="animate-glow" />}
          className="top-1/2 left-32 hidden lg:block"
          delay={2.5}
          amplitude={18}
          duration={4.2}
        />

        <div className="relative z-10 container mx-auto px-4 py-20 min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-sm font-medium animate-pulse">
                    ✨ Limited Time Offer
                  </span>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                  Shop Like a{' '}
                  <GradientText gradient="rainbow" className="text-6xl lg:text-7xl">
                    Rockstar
                  </GradientText>
                </h1>
                
                <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-lg">
                  Unleash your shopping superpowers! Get exclusive deals, lightning-fast delivery, 
                  and products that make your friends jealous. 
                  <span className="text-yellow-400 font-semibold"> Your wallet will thank you! 💸</span>
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>10M+ Happy Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-2000"></div>
                  <span>99.9% Satisfaction Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-4000"></div>
                  <span>24/7 Instant Support</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/products">
                  <PulseButton variant="primary" className="text-lg px-8 py-4">
                    🚀 Start Shopping Now
                  </PulseButton>
                </Link>
                <Link href="/categories">
                  <PulseButton variant="outline" className="text-lg px-8 py-4">
                    🎯 Browse Collections
                  </PulseButton>
                </Link>
              </div>

              {/* Special Offer */}
              <div className="inline-block">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-2xl font-bold text-lg animate-bounce-slow">
                  🔥 FREE SHIPPING + 50% OFF YOUR FIRST ORDER!
                </div>
              </div>
            </div>

            {/* Right Content - Stats Cards */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <GlowingCard glowColor="blue" className="text-center transform rotate-2 hover:rotate-0">
                  <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    1M+
                  </div>
                  <div className="text-sm text-gray-300 mt-2">Products Available</div>
                  <div className="text-xs text-gray-400 mt-1">Updated Daily</div>
                </GlowingCard>

                <GlowingCard glowColor="purple" className="text-center transform -rotate-2 hover:rotate-0 mt-8">
                  <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    24/7
                  </div>
                  <div className="text-sm text-gray-300 mt-2">Support</div>
                  <div className="text-xs text-gray-400 mt-1">Always Here</div>
                </GlowingCard>

                <GlowingCard glowColor="green" className="text-center transform rotate-1 hover:rotate-0 -mt-4">
                  <div className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    2 Days
                  </div>
                  <div className="text-sm text-gray-300 mt-2">Delivery</div>
                  <div className="text-xs text-gray-400 mt-1">Worldwide</div>
                </GlowingCard>

                <GlowingCard glowColor="pink" className="text-center transform -rotate-1 hover:rotate-0 mt-4">
                  <div className="text-4xl font-black bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                    100%
                  </div>
                  <div className="text-sm text-gray-300 mt-2">Secure</div>
                  <div className="text-xs text-gray-400 mt-1">Guaranteed</div>
                </GlowingCard>
              </div>

              {/* Floating promotional badges */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold transform rotate-12 animate-pulse">
                HOT DEALS! 🔥
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold transform -rotate-12 animate-pulse animation-delay-2000">
                FREE SHIPPING 📦
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100 overflow-hidden">
        <AnimatedBackground variant="categories" intensity="low" particleCount={10} />
        
        <div className="relative z-10 container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-medium">
                🛍️ Discover Categories
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Shop by{' '}
              <GradientText gradient="ocean" className="text-4xl lg:text-5xl">
                Category
              </GradientText>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our carefully curated collections and discover amazing products 
              tailored to your lifestyle and interests.
            </p>
          </div>

          {/* Categories Grid - Centered */}
          <div className="flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 max-w-6xl">
              {categories.map((category, index) => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* View All Categories Button */}
          <div className="text-center mt-12">
            <Link href="/categories">
              <PulseButton variant="secondary" className="px-8 py-4">
                🎯 View All Categories
              </PulseButton>
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-slate-400/20 to-blue-500/20 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full animate-bounce-slow animation-delay-2000"></div>
        <div className="absolute top-1/3 right-20 w-12 h-12 bg-gradient-to-br from-indigo-400/20 to-slate-500/20 rounded-full animate-float"></div>
      </section>

      {/* Featured Products */}
      <section className="relative py-20 bg-gradient-to-br from-violet-100 via-purple-100 to-fuchsia-100 overflow-hidden">
        <AnimatedBackground variant="products" intensity="low" particleCount={12} />
        
        <div className="relative z-10 container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium animate-pulse">
                ⭐ Featured Collection
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Trending{' '}
              <GradientText gradient="sunset" className="text-4xl lg:text-5xl">
                Products
              </GradientText>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our handpicked selection of premium products that everyone's talking about. 
              Quality guaranteed, style perfected.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onWishlistToggle={handleWishlistToggle}
                isInWishlist={isInWishlist}
              />
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link href="/products">
              <PulseButton variant="primary" className="px-8 py-4">
                🛍️ View All Products
              </PulseButton>
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-24 h-24 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-fuchsia-500/20 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-br from-fuchsia-400/20 to-violet-500/20 rounded-full animate-bounce-slow"></div>
      </section>

      {/* Top Brands */}
      <section className="relative py-20 bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 overflow-hidden">
        <AnimatedBackground variant="brands" intensity="low" particleCount={8} />
        
        <div className="relative z-10 container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full text-sm font-medium">
                🏆 Premium Brands
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Trusted{' '}
              <GradientText gradient="ocean" className="text-4xl lg:text-5xl">
                Brands
              </GradientText>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Shop from the world's most loved and trusted brands. Quality, innovation, 
              and style that you can count on.
            </p>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brands.map((brand, index) => (
              <BrandCard 
                key={brand.id} 
                brand={brand} 
                index={index}
              />
            ))}
          </div>

          {/* View All Brands Button */}
          <div className="text-center mt-12">
            <Link href="/brands">
              <PulseButton variant="outline" className="px-8 py-4">
                🌟 Explore All Brands
              </PulseButton>
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-16 right-16 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-16 left-16 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 right-32 w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full animate-float"></div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 overflow-hidden">
        <AnimatedBackground variant="features" intensity="low" particleCount={10} />
        
        <div className="relative z-10 container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium">
                💎 Why Choose Us
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Unmatched{' '}
              <GradientText gradient="ocean" className="text-4xl lg:text-5xl">
                Excellence
              </GradientText>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the difference with our premium services designed to exceed your expectations 
              at every step of your shopping journey.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              gradient="blue"
              icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              title="Lightning Fast Delivery"
              description="Free express shipping on orders over $50. Get your products delivered within 24-48 hours with real-time tracking."
            />
            
            <FeatureCard
              gradient="green"
              icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Premium Quality Assured"
              description="Every product undergoes rigorous quality testing. 100% authentic items with lifetime warranty and easy returns."
            />
            
            <FeatureCard
              gradient="purple"
              icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              title="Expert Support 24/7"
              description="Our dedicated support team is available round-the-clock via chat, email, and phone to assist with any questions."
            />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-16 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full animate-float"></div>
        <div className="absolute bottom-16 right-20 w-24 h-24 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full animate-bounce-slow animation-delay-2000"></div>
        <div className="absolute top-1/3 right-16 w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-emerald-500/20 rounded-full animate-float animation-delay-4000"></div>
      </section>
    </Layout>
  )
}
