import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewForm from '../../../src/components/ReviewForm/ReviewForm';
import { apiFetch } from '../../../src/lib/api';

// Mock apiFetch
jest.mock('../../../src/lib/api', () => ({
  apiFetch: jest.fn(),
}));

const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

// Mock AuthContext
const mockUseAuth = jest.fn();
jest.mock('../../../src/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock ToastContext
const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
};
jest.mock('../../../src/context/ToastContext', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

describe('ReviewForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default to logged-in user
    mockUseAuth.mockReturnValue({
      user: { _id: 'user_123', email: 'user@example.com', name: 'John Doe' },
      loading: false,
    });
  });

  it('should render please login prompt if user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(<ReviewForm productId="prod_123" />);
    expect(screen.getByText('Please log in to submit a review')).toBeInTheDocument();
  });

  it('should render form fields when user is authenticated', () => {
    render(<ReviewForm productId="prod_123" />);
    expect(screen.getByRole('heading', { name: 'Write a Review' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Title \(optional\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Review \*/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Review/i })).toBeInTheDocument();
  });

  it('should display validation error on submit if no rating is selected', async () => {
    const { container } = render(<ReviewForm productId="prod_123" />);
    const form = container.querySelector('form');

    // Submit form directly to bypass disabled button
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText('Please select a rating')).toBeInTheDocument();
    });
  });

  it('should display validation error if comment is too short', async () => {
    render(<ReviewForm productId="prod_123" />);
    
    // Select a rating (e.g. 4 stars)
    const stars = screen.getAllByRole('button', { name: /Rate \d out of 5 stars/i });
    fireEvent.click(stars[3]); // 4th star

    // Type a short comment
    const commentInput = screen.getByLabelText(/Review \*/i);
    await userEvent.type(commentInput, 'short');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Review must be at least 10 characters');
    });
  });

  it('should submit successfully and trigger callback when input is valid', async () => {
    const mockOnSubmit = jest.fn();
    mockApiFetch.mockResolvedValueOnce({
      success: true,
      data: {
        review: {
          _id: 'rev_123',
          rating: 5,
          title: 'Great product',
          comment: 'Highly recommended!',
        },
      },
    });

    render(<ReviewForm productId="prod_123" onReviewSubmitted={mockOnSubmit} />);

    // Select 5 stars
    const stars = screen.getAllByRole('button', { name: /Rate \d out of 5 stars/i });
    fireEvent.click(stars[4]); // 5th star

    // Enter title & comment
    const titleInput = screen.getByLabelText(/Title \(optional\)/i);
    await userEvent.type(titleInput, 'Great product');

    const commentInput = screen.getByLabelText(/Review \*/i);
    await userEvent.type(commentInput, 'Highly recommended!');

    const submitBtn = screen.getByRole('button', { name: /Submit Review/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockApiFetch).toHaveBeenCalledWith('/reviews/prod_123', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          rating: 5,
          title: 'Great product',
          comment: 'Highly recommended!',
        }),
      }));
      expect(mockToast.success).toHaveBeenCalledWith('Review submitted successfully');
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'rev_123',
        rating: 5,
      }));
    });
  });
});
