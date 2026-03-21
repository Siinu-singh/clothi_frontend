# Clothi E-Commerce API Documentation

## Overview

The Clothi E-Commerce API is a comprehensive backend service providing authentication, product management, shopping cart, orders, reviews, and coupon systems for an e-commerce platform.

**Base URL:** `http://localhost:3000/api`

**API Docs:** `http://localhost:3000/api-docs` (Swagger UI)

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Authentication Endpoints

#### Register User
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Response (201):** User object with tokens

#### Login
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response (200):** User object with access and refresh tokens

#### Google OAuth
- **POST** `/auth/login/google`
- **Body:** `{ "idToken": "google_id_token" }`
- **Response (200):** User object with tokens

#### Apple OAuth
- **POST** `/auth/login/apple`
- **Body:** `{ "idToken": "apple_id_token" }`
- **Response (200):** User object with tokens

#### Email Verification
- **POST** `/auth/verify-email`
- **Body:** `{ "token": "verification_token" }`
- **Response (200):** Verification confirmed

#### Password Reset
- **POST** `/auth/request-password-reset`
- **Body:** `{ "email": "user@example.com" }`
- **POST** `/auth/reset-password`
- **Body:** `{ "token": "reset_token", "newPassword": "new_password" }`

---

## Reviews & Ratings

### Create Review
- **POST** `/reviews/:productId` (Protected)
- **Body:**
  ```json
  {
    "rating": 4,
    "title": "Great product!",
    "comment": "This product exceeded my expectations..."
  }
  ```
- **Response (201):** Review object
- **Note:** Users can only leave one review per product

### Get Product Reviews
- **GET** `/reviews/:productId?status=approved&sortBy=recent&limit=10&page=1`
- **Query Parameters:**
  - `status`: 'approved' | 'pending' | 'rejected' (default: 'approved')
  - `sortBy`: 'recent' | 'rating' | 'helpful' (default: 'recent')
  - `limit`: number (default: 10)
  - `page`: number (default: 1)
- **Response (200):**
  ```json
  {
    "reviews": [...],
    "pagination": { "total": 25, "page": 1, "limit": 10, "pages": 3 },
    "stats": {
      "averageRating": 4.5,
      "totalReviews": 25,
      "ratingDistribution": { "5": 15, "4": 8, "3": 2, "2": 0, "1": 0 }
    }
  }
  ```

### Get User's Reviews
- **GET** `/reviews/user/my-reviews?limit=10&page=1` (Protected)
- **Response (200):** User's reviews with pagination

### Update Review
- **PATCH** `/reviews/:reviewId` (Protected)
- **Body:** `{ "rating": 5, "comment": "Updated comment", "title": "New title" }`
- **Response (200):** Updated review object

### Delete Review
- **DELETE** `/reviews/:reviewId` (Protected)
- **Response (204):** No content

### Mark Review as Helpful
- **POST** `/reviews/:reviewId/helpful`
- **Body:** `{ "helpful": true }`
- **Response (200):** Updated review object

### Admin Review Management
- **POST** `/reviews/:reviewId/approve` (Protected, Admin only)
- **POST** `/reviews/:reviewId/reject` (Protected, Admin only)
- **GET** `/reviews/admin/pending?limit=10&page=1` (Protected, Admin only)

---

## Coupons & Discounts

### Create Coupon
- **POST** `/coupons` (Protected, Admin only)
- **Body:**
  ```json
  {
    "code": "SUMMER20",
    "type": "percentage",
    "value": 20,
    "maxDiscount": 100,
    "minPurchaseAmount": 50,
    "maxUses": 1000,
    "maxUsesPerUser": 2,
    "expiryDate": "2024-12-31T23:59:59Z",
    "applicableCategories": ["Men", "Women"],
    "description": "20% off summer collection"
  }
  ```
- **Response (201):** Coupon object

### Validate Coupon
- **POST** `/coupons/validate` (Protected)
- **Body:**
  ```json
  {
    "code": "SUMMER20",
    "subtotal": 100,
    "cartItems": [
      { "productId": "123", "category": "Men" }
    ]
  }
  ```
- **Response (200):**
  ```json
  {
    "valid": true,
    "discount": 20,
    "coupon": { ... }
  }
  ```

### Get All Coupons
- **GET** `/coupons?limit=10&page=1&activeOnly=true` (Protected, Admin only)
- **Response (200):** List of coupons with pagination

### Update Coupon
- **PATCH** `/coupons/:couponId` (Protected, Admin only)
- **Response (200):** Updated coupon object

### Delete Coupon
- **DELETE** `/coupons/:couponId` (Protected, Admin only)
- **Response (204):** No content

### Get Coupons by Product
- **GET** `/coupons/product/:productId`
- **Response (200):** Available coupons for the product

### Get Coupons by Category
- **GET** `/coupons/category/:category`
- **Response (200):** Available coupons for the category

---

## Orders

### Create Order
- **POST** `/orders` (Protected)
- **Body:**
  ```json
  {
    "items": [
      {
        "productId": "123",
        "title": "Product Name",
        "price": 99.99,
        "quantity": 2,
        "size": "M",
        "color": "Black"
      }
    ],
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "subtotal": 199.98,
    "tax": 20,
    "shippingCost": 10,
    "discount": 20,
    "total": 209.98,
    "couponCode": "SUMMER20"
  }
  ```
- **Response (201):** Order object

### Get User's Orders
- **GET** `/orders?limit=10&page=1` (Protected)
- **Response (200):** User's orders with pagination

### Get Order Details
- **GET** `/orders/:orderId` (Protected)
- **Response (200):** Complete order details

### Update Order Status
- **PATCH** `/orders/:orderId/status` (Protected, Admin only)
- **Body:** `{ "status": "processing" }`

### Update Payment Status
- **PATCH** `/orders/:orderId/payment-status` (Protected, Admin only)
- **Body:** `{ "status": "completed", "paymentId": "stripe_id" }`

### Add Tracking Number
- **PATCH** `/orders/:orderId/tracking` (Protected, Admin only)
- **Body:** `{ "trackingNumber": "TRACK123456" }`

### Cancel Order
- **POST** `/orders/:orderId/cancel` (Protected)
- **Response (200):** Cancelled order

---

## User Profile

### Get Current Profile
- **GET** `/profile` (Protected)
- **Response (200):** Current user profile

### Update Profile
- **PATCH** `/profile` (Protected)
- **Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://example.com/avatar.jpg"
  }
  ```
- **Response (200):** Updated profile

### Get User Statistics
- **GET** `/profile/statistics` (Protected)
- **Response (200):** Account stats (email verified, OAuth providers, etc.)

### Update Avatar
- **PATCH** `/profile/avatar` (Protected)
- **Body:** `{ "avatarUrl": "https://example.com/new-avatar.jpg" }`

### Delete Account
- **DELETE** `/profile` (Protected)
- **Body:** `{ "password": "current_password" }`
- **Response (204):** No content

### Get Public Profile
- **GET** `/profile/:userId`
- **Response (200):** Public user information

### Search Users
- **GET** `/profile/search?q=john&limit=10`
- **Response (200):** Array of matching users

### Check Email Availability
- **GET** `/profile/check-email?email=user@example.com`
- **Response (200):** `{ "available": true }`

---

## Addresses

### Create Address
- **POST** `/addresses` (Protected)
- **Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "type": "shipping",
    "isDefault": true
  }
  ```
- **Response (201):** Address object

### Get User's Addresses
- **GET** `/addresses` (Protected)
- **Response (200):** Array of addresses

### Get Default Address
- **GET** `/addresses/default` (Protected)
- **Response (200):** Default address

### Get Addresses by Type
- **GET** `/addresses/type/shipping` (Protected)
- **Response (200):** Addresses of specified type

### Update Address
- **PATCH** `/addresses/:addressId` (Protected)
- **Response (200):** Updated address

### Delete Address
- **DELETE** `/addresses/:addressId` (Protected)
- **Response (204):** No content

### Set Default Address
- **POST** `/addresses/:addressId/default` (Protected)
- **Response (200):** Updated address

---

## Products

### Get All Products
- **GET** `/products?category=Men&limit=10&page=1&search=shirt`

### Get Product Details
- **GET** `/products/:productId`

### Create Product
- **POST** `/products` (Protected, Admin only)

### Update Product
- **PATCH** `/products/:productId` (Protected, Admin only)

### Delete Product
- **DELETE** `/products/:productId` (Protected, Admin only)

---

## Shopping Cart

### Add to Cart
- **POST** `/cart/add` (Protected)
- **Body:** `{ "productId": "123", "quantity": 2, "size": "M", "color": "Black" }`

### Get Cart
- **GET** `/cart` (Protected)

### Update Cart Item
- **PATCH** `/cart/:itemId` (Protected)

### Remove from Cart
- **DELETE** `/cart/:itemId` (Protected)

### Clear Cart
- **DELETE** `/cart` (Protected)

---

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "error": "ErrorType",
  "message": "Error description"
}
```

### Common Error Codes

- **400**: Bad Request - Invalid input
- **401**: Unauthorized - Invalid or missing token
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **409**: Conflict - Resource already exists
- **500**: Internal Server Error

---

## Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

---

## Rate Limiting

API requests are rate limited:
- Default limit: 100 requests per 15 minutes per IP
- Limits returned in response headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

---

## Security

### Best Practices

1. Always use HTTPS in production
2. Never expose JWT tokens in client-side code
3. Use secure, httpOnly cookies for token storage
4. Implement CSRF protection for state-changing operations
5. Validate and sanitize all user inputs
6. Use rate limiting and WAF in production

### Authentication Flow

1. User registers or logs in
2. Server returns JWT access token and refresh token
3. Client includes access token in Authorization header
4. On token expiry, use refresh token to get new access token
5. Refresh token should be stored securely (httpOnly cookie)

---

## Examples

### Complete Order Flow with Coupon

```bash
# 1. Validate coupon
curl -X POST http://localhost:3000/api/coupons/validate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SUMMER20",
    "subtotal": 150,
    "cartItems": [{"productId": "123", "category": "Men"}]
  }'

# 2. Create order with coupon
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [...],
    "shippingAddress": {...},
    "subtotal": 150,
    "tax": 12,
    "shippingCost": 10,
    "discount": 30,
    "total": 142,
    "couponCode": "SUMMER20"
  }'
```

### Post a Review

```bash
curl -X POST http://localhost:3000/api/reviews/123 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "title": "Excellent product",
    "comment": "This product is exactly what I was looking for..."
  }'
```

---

## API Status

**Swagger/OpenAPI Documentation:** Available at `/api-docs`

**Health Check Endpoint:** `GET /health`

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## Support

For API support or issues, please contact: support@clothi.com

**Last Updated:** March 2024
**API Version:** 1.0.0
