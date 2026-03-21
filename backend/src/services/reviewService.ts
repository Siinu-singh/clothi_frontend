import { Review, IReview } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { NotFoundError, ValidationError, UnauthorizedError } from '../utils/errors.js';
import { Types } from 'mongoose';

export interface CreateReviewInput {
  rating: number;
  title?: string;
  comment: string;
}

export interface UpdateReviewInput {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface GetReviewsOptions {
  status?: 'pending' | 'approved' | 'rejected';
  sortBy?: 'recent' | 'rating' | 'helpful';
  limit?: number;
  page?: number;
}

export class ReviewService {
  /**
   * Create a review for a product
   */
  async createReview(
    productId: string,
    userId: string,
    input: CreateReviewInput
  ): Promise<IReview> {
    try {
      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        throw new NotFoundError('Product not found');
      }

      // Check if user has already reviewed this product
      const existingReview = await Review.findOne({
        productId: new Types.ObjectId(productId),
        userId: new Types.ObjectId(userId),
      });

      if (existingReview) {
        throw new ValidationError('You have already reviewed this product');
      }

      // Check if user has purchased this product (verified purchase)
      const order = await Order.findOne({
        userId: new Types.ObjectId(userId),
        'items.productId': new Types.ObjectId(productId),
        status: { $in: ['delivered', 'completed'] },
      });

      const review = new Review({
        productId: new Types.ObjectId(productId),
        userId: new Types.ObjectId(userId),
        rating: input.rating,
        title: input.title,
        comment: input.comment,
        verifiedPurchase: !!order,
      });

      await review.save();
      return review.toObject();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get reviews for a product
   */
  async getProductReviews(
    productId: string,
    options: GetReviewsOptions = {}
  ): Promise<{
    reviews: IReview[];
    pagination: { total: number; page: number; limit: number; pages: number };
    stats: {
      averageRating: number;
      totalReviews: number;
      ratingDistribution: Record<number, number>;
    };
  }> {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new NotFoundError('Product not found');
      }

      const { status = 'approved', limit = 10, page = 1 } = options;
      const skip = (page - 1) * limit;

      // Build query
      const query: any = {
        productId: new Types.ObjectId(productId),
        status,
      };

      // Count total
      const total = await Review.countDocuments(query);

      // Sort options
      let sortOption: any = { createdAt: -1 };
      if (options.sortBy === 'rating') {
        sortOption = { rating: -1 };
      } else if (options.sortBy === 'helpful') {
        sortOption = { helpful: -1 };
      }

      // Get reviews
      const reviews = await Review.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean();

      // Calculate statistics
      const allReviews = await Review.find({
        productId: new Types.ObjectId(productId),
        status: 'approved',
      });

      const ratingDistribution = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      let totalRating = 0;
      allReviews.forEach((review) => {
        totalRating += review.rating;
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      });

      const averageRating =
        allReviews.length > 0 ? totalRating / allReviews.length : 0;

      return {
        reviews: reviews as IReview[],
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
        stats: {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: allReviews.length,
          ratingDistribution,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user's reviews
   */
  async getUserReviews(
    userId: string,
    limit = 10,
    page = 1
  ): Promise<{
    reviews: IReview[];
    pagination: { total: number; page: number; limit: number; pages: number };
  }> {
    try {
      const skip = (page - 1) * limit;

      const total = await Review.countDocuments({
        userId: new Types.ObjectId(userId),
      });

      const reviews = await Review.find({
        userId: new Types.ObjectId(userId),
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('productId', 'title image price')
        .lean();

      return {
        reviews: reviews as IReview[],
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get single review
   */
  async getReviewById(reviewId: string): Promise<IReview> {
    try {
      const review = await Review.findById(reviewId).populate(
        'productId userId'
      );

      if (!review) {
        throw new NotFoundError('Review not found');
      }

      return review.toObject();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update review
   */
  async updateReview(
    reviewId: string,
    userId: string,
    input: UpdateReviewInput
  ): Promise<IReview> {
    try {
      const review = await Review.findById(reviewId);

      if (!review) {
        throw new NotFoundError('Review not found');
      }

      // Check authorization
      if (review.userId.toString() !== userId) {
        throw new UnauthorizedError('You can only edit your own reviews');
      }

      if (input.rating !== undefined) {
        review.rating = input.rating;
      }
      if (input.title !== undefined) {
        review.title = input.title;
      }
      if (input.comment !== undefined) {
        review.comment = input.comment;
      }

      await review.save();
      return review.toObject();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete review
   */
  async deleteReview(reviewId: string, userId: string): Promise<void> {
    try {
      const review = await Review.findById(reviewId);

      if (!review) {
        throw new NotFoundError('Review not found');
      }

      // Check authorization
      if (review.userId.toString() !== userId) {
        throw new UnauthorizedError('You can only delete your own reviews');
      }

      await Review.findByIdAndDelete(reviewId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark review as helpful/unhelpful
   */
  async markReviewHelpful(
    reviewId: string,
    helpful: boolean
  ): Promise<IReview> {
    try {
      const review = await Review.findById(reviewId);

      if (!review) {
        throw new NotFoundError('Review not found');
      }

      if (helpful) {
        review.helpful += 1;
      } else {
        review.unhelpful += 1;
      }

      await review.save();
      return review.toObject();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Approve review (admin)
   */
  async approveReview(reviewId: string): Promise<IReview> {
    try {
      const review = await Review.findByIdAndUpdate(
        reviewId,
        { status: 'approved' },
        { new: true }
      );

      if (!review) {
        throw new NotFoundError('Review not found');
      }

      return review.toObject();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reject review (admin)
   */
  async rejectReview(reviewId: string): Promise<IReview> {
    try {
      const review = await Review.findByIdAndUpdate(
        reviewId,
        { status: 'rejected' },
        { new: true }
      );

      if (!review) {
        throw new NotFoundError('Review not found');
      }

      return review.toObject();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get pending reviews (admin)
   */
  async getPendingReviews(limit = 10, page = 1): Promise<{
    reviews: IReview[];
    pagination: { total: number; page: number; limit: number; pages: number };
  }> {
    try {
      const skip = (page - 1) * limit;

      const total = await Review.countDocuments({ status: 'pending' });

      const reviews = await Review.find({ status: 'pending' })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .populate('productId userId')
        .lean();

      return {
        reviews: reviews as IReview[],
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

export const reviewService = new ReviewService();
