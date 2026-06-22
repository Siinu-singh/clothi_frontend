'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Collection } from '@/models/collection';

interface CollectionCardProps {
  collection: Collection;
  variant?: 'grid' | 'featured';
}

export default function CollectionCard({
  collection,
  variant = 'grid',
}: CollectionCardProps) {
  const mainImage = collection.images.find((img) => img.isMain) || collection.images[0];
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

  if (variant === 'featured') {
    return (
      <Link href={`/collections/${collection.slug}`}>
        <div className="group cursor-pointer">
          <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-video mb-4">
            {mainImage && (
              <Image
                src={mainImage.url}
                alt={collection.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition duration-300"
              />
            )}
            {discountPercent > 0 && (
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                -{discountPercent}%
              </div>
            )}
            {collection.isFeatured && (
              <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ★ Featured
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
            {collection.name}
          </h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {collection.description}
          </p>
          <div className="flex items-center gap-2 mt-3">
            {discountPercent > 0 ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  ₹{Math.round(finalPrice * 100) / 100}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₹{collection.basePrice}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ₹{collection.basePrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/collections/${collection.slug}`}>
      <div className="group cursor-pointer h-full">
        <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square mb-4">
          {mainImage && (
            <Image
              src={mainImage.url}
              alt={collection.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          )}

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{discountPercent}%
            </div>
          )}

          {/* Low Stock Badge */}
          {isLowStock && (
            <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Low Stock
            </div>
          )}

          {/* Overlay with Quick View */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
            <button className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition transform -translate-y-2 group-hover:translate-y-0">
              View Details
            </button>
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {collection.category}
          </p>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition">
            {collection.name}
          </h3>

          {/* Tags */}
          {collection.tags.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {collection.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {collection.tags.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{collection.tags.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mt-3">
            {discountPercent > 0 ? (
              <>
                <span className="font-bold text-gray-900">
                  ₹{Math.round(finalPrice * 100) / 100}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  ₹{collection.basePrice}
                </span>
              </>
            ) : (
              <span className="font-bold text-gray-900">₹{collection.basePrice}</span>
            )}
          </div>

          {/* Stock Info */}
          <div className="mt-2 text-xs text-gray-600">
            {collection.availableStock > 0 ? (
              <span>
                {collection.availableStock}/{collection.totalStock} available
              </span>
            ) : (
              <span className="text-red-600 font-semibold">Out of stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
