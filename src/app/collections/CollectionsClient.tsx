'use client';
import { useEffect, useState } from 'react';
import { useCollection } from '@/context/CollectionContext';
import CollectionCard from '@/components/public/CollectionCard';

const CATEGORIES = [
  'All',
  'Dresses',
  'Tops',
  'Bottoms',
  'Jackets',
  'Accessories',
  'Seasonal',
  'Limited Edition',
];

const TAGS = [
  'New',
  'Sale',
  'Trending',
  'Best Seller',
  'Limited',
  'Eco Friendly',
];

export default function CollectionsClient() {
  const { collections, loading, loadCollections, pagination } = useCollection() as any;
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (selectedCategory === 'All') {
      loadCollections(page);
    } else {
      // Load by category
      loadCollections(page, 12, { category: selectedCategory });
    }
  }, [selectedCategory, page, loadCollections]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    // Implement search
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900">Collections</h1>
          <p className="text-gray-600 mt-2">Browse our curated collection of fashion</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`text-sm px-3 py-1 rounded-full transition ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Collections Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading collections...</p>
              </div>
            ) : collections.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No collections found</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedTags([]);
                    setSearchQuery('');
                    setPage(1);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <p className="text-gray-600 mb-6">
                  Showing {collections.length} of {pagination.total} collections
                </p>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {collections.map((collection) => (
                    <CollectionCard
                      key={collection._id}
                      collection={collection}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {Array.from({ length: pagination.pages }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPage(idx + 1)}
                        className={`px-3 py-2 rounded-lg transition ${
                          page === idx + 1
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                      disabled={page === pagination.pages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
