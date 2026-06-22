'use client';
import { useState, useEffect } from 'react';
import { Collection, CreateCollectionInput, CollectionImage } from '@/models/collection';
import ImageUploader from './ImageUploader';
import PricingSection from './PricingSection';
import InventorySection from './InventorySection';
import SeoSection from './SeoSection';
import MetadataSection from './MetadataSection';
import { sanitizeString } from '@/lib/sanitize';

interface CollectionFormProps {
  initialData?: Collection;
  onSubmit: (data: CreateCollectionInput | any) => Promise<void>;
  isLoading?: boolean;
}

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function CollectionForm({
  initialData,
  onSubmit,
  isLoading = false,
}: CollectionFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    images: initialData?.images || [],
    basePrice: initialData?.basePrice || 0,
    discountType: (initialData?.discountType as any) || null,
    discountValue: initialData?.discountValue || 0,
    discountStartDate: initialData?.discountStartDate || '',
    discountEndDate: initialData?.discountEndDate || '',
    totalStock: initialData?.totalStock || 0,
    availableStock: initialData?.availableStock || 0,
    lowStockThreshold: initialData?.lowStockThreshold || 10,
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    seoKeywords: initialData?.seoKeywords || [],
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Auto-generate slug from name
  useEffect(() => {
    if (!initialData && formData.name) {
      setFormData((prev) => ({
        ...prev,
        slug: slugify(formData.name),
      }));
    }
  }, [formData.name, initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';
    if (formData.basePrice <= 0) newErrors.basePrice = 'Base price must be greater than 0';
    if (formData.totalStock < formData.availableStock)
      newErrors.totalStock = 'Total stock must be >= available stock';
    if (!formData.category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) {
      return;
    }

    try {
      const sanitizedData = {
        ...formData,
        name: sanitizeString(formData.name),
        description: sanitizeString(formData.description),
        seoTitle: sanitizeString(formData.seoTitle),
        seoDescription: sanitizeString(formData.seoDescription),
      };
      await onSubmit(sanitizedData);
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collection Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="e.g., Summer Vibes Collection"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL) *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  slug: slugify(e.target.value),
                }))
              }
              placeholder="auto-generated from name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug}</p>}
            <p className="text-xs text-gray-500 mt-1">URL-friendly identifier</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Collection description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <ImageUploader
        initialImages={formData.images}
        onImagesChange={(images) =>
          setFormData((prev) => ({
            ...prev,
            images,
          }))
        }
      />
      {errors.images && <p className="text-red-600 text-sm">{errors.images}</p>}

      {/* Pricing */}
      <PricingSection
        basePrice={formData.basePrice}
        discountType={formData.discountType}
        discountValue={formData.discountValue}
        discountStartDate={formData.discountStartDate}
        discountEndDate={formData.discountEndDate}
        onBasePriceChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            basePrice: value,
          }))
        }
        onDiscountTypeChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            discountType: value,
            discountValue: 0,
          }))
        }
        onDiscountValueChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            discountValue: value,
          }))
        }
        onDiscountStartDateChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            discountStartDate: value,
          }))
        }
        onDiscountEndDateChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            discountEndDate: value,
          }))
        }
      />
      {errors.basePrice && <p className="text-red-600 text-sm">{errors.basePrice}</p>}

      {/* Inventory */}
      <InventorySection
        totalStock={formData.totalStock}
        availableStock={formData.availableStock}
        lowStockThreshold={formData.lowStockThreshold}
        onTotalStockChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            totalStock: value,
          }))
        }
        onAvailableStockChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            availableStock: value,
          }))
        }
        onLowStockThresholdChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            lowStockThreshold: value,
          }))
        }
      />
      {errors.totalStock && <p className="text-red-600 text-sm">{errors.totalStock}</p>}

      {/* SEO */}
      <SeoSection
        seoTitle={formData.seoTitle}
        seoDescription={formData.seoDescription}
        seoKeywords={formData.seoKeywords}
        onSeoTitleChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            seoTitle: value,
          }))
        }
        onSeoDescriptionChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            seoDescription: value,
          }))
        }
        onSeoKeywordsChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            seoKeywords: value,
          }))
        }
      />

      {/* Metadata */}
      <MetadataSection
        category={formData.category}
        tags={formData.tags}
        isActive={formData.isActive}
        isFeatured={formData.isFeatured}
        onCategoryChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            category: value,
          }))
        }
        onTagsChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            tags: value,
          }))
        }
        onActiveChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            isActive: value,
          }))
        }
        onFeaturedChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            isFeatured: value,
          }))
        }
      />
      {errors.category && <p className="text-red-600 text-sm">{errors.category}</p>}

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Collection' : 'Create Collection'}
        </button>
      </div>
    </form>
  );
}
