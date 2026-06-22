'use client';
import { useState } from 'react';
import { Collection } from '@/models/collection';
import Link from 'next/link';
import Image from 'next/image';

interface CollectionDetailProps {
  collection: Collection;
}

export default function CollectionDetail({ collection }: CollectionDetailProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedImage = collection.images[selectedImageIdx];
  const discountPercent =
    collection.discountType === 'percentage' ? (collection.discountValue || 0) : 0;
  const finalPrice =
    collection.discountType === 'percentage'
      ? collection.basePrice - (collection.basePrice * (collection.discountValue || 0)) / 100
      : collection.discountType === 'fixed'
      ? collection.basePrice - (collection.discountValue || 0)
      : collection.basePrice;

  const isLowStock =
    collection.availableStock <= (collection.lowStockThreshold || 10);
  const isOutOfStock = collection.availableStock <= 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-gray-900">
              Collections
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{collection.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square mb-4">
              {selectedImage && (
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.alt || collection.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              )}

              {/* Discount Badge */}
              {discountPercent > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discountPercent}%
                </div>
              )}

              {/* Featured Badge */}
              {collection.isFeatured && (
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ★ Featured
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {collection.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {collection.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                      idx === selectedImageIdx
                        ? 'border-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${collection.name} ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {/* Category & Tags */}
            <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">
              {collection.category}
            </p>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {collection.name}
            </h1>

            {/* Tags */}
            {collection.tags.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {collection.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {collection.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">
                {collection.description}
              </p>
            )}

            {/* Price Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{Math.round(finalPrice * 100) / 100}
                </span>
                {discountPercent > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{collection.basePrice}
                    </span>
                    <span className="text-lg font-semibold text-red-600">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="mt-4">
                {isOutOfStock ? (
                  <p className="text-red-600 font-semibold">Out of stock</p>
                ) : isLowStock ? (
                  <p className="text-orange-600 font-semibold">
                    Only {collection.availableStock} left in stock
                  </p>
                ) : (
                  <p className="text-green-600 font-semibold">
                    {collection.availableStock} in stock
                  </p>
                )}
              </div>
            </div>

            {/* Add to Cart Section */}
            {!isOutOfStock && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(collection.availableStock, quantity + 1)
                        )
                      }
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  disabled={isOutOfStock}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  Add to Cart
                </button>
              </div>
            )}

            {/* Additional Info */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Collection ID</p>
                  <p className="font-mono text-xs text-gray-900 break-all">
                    {collection.slug}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Stock</p>
                  <p className="font-semibold text-gray-900">
                    {collection.totalStock}
                  </p>
                </div>
              </div>

              {collection.discountStartDate && (
                <div>
                  <p className="text-sm text-gray-600">Discount Period</p>
                  <p className="text-sm text-gray-900">
                    {new Date(collection.discountStartDate).toLocaleDateString()} -{' '}
                    {collection.discountEndDate
                      ? new Date(collection.discountEndDate).toLocaleDateString()
                      : 'Ongoing'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
