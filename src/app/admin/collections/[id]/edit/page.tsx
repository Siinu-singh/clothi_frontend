'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCollection } from '@/context/CollectionContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import CollectionForm from '@/components/admin/CollectionForm';

export default function EditCollectionPage() {
  const router = useRouter();
  const params = useParams();
  const collectionId = params.id as string;

  const { user, loading: authLoading } = useAuth();
  const { collections, loadAllCollections, handleUpdateCollection } = useCollection();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingCollection, setLoadingCollection] = useState(true);

  const collection = collections.find((c) => c._id === collectionId);

  useEffect(() => {
    if (!authLoading && user) {
      loadAllCollections().finally(() => setLoadingCollection(false));
    }
  }, [authLoading, user, loadAllCollections]);

  if (authLoading || loadingCollection) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">You must be logged in as admin</p>
          <Link href="/login" className="text-blue-600 hover:text-blue-800">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Collection not found</p>
          <Link href="/admin/collections" className="text-blue-600 hover:text-blue-800">
            Back to collections
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      await handleUpdateCollection(collectionId, formData);
      toast.success('Collection updated successfully!');
      router.push('/admin/collections');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update collection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/collections"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Collection</h1>
              <p className="text-gray-500 mt-1">{collection.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CollectionForm
          initialData={collection}
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
