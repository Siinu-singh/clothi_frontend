# Backend Requirements: Clothi E-Commerce

## Context
Recreating the Faherty Brand website within the Clothi e-commerce application. This project requires a robust, scalable backend to handle user authentication, product catalogs, order management, and social feed integration.

## Screens/Components

### Authentication (Login/Signup)
**Purpose**: Securely authenticate users and manage sessions.

**Data I need to display**:
- User profile (name, email, avatar).
- Social login connection status.

**Actions**:
- Login with Email/Password → Returns session token (JWT).
- Continue with Google/Apple → OAuth flow returning session token.
- Logout → Invalidates session.

**States to handle**:
- **Error**: Invalid credentials, account locked, social provider failure.

---

### Product Catalog & Search
**Purpose**: Browsing and finding products.

**Data I need to display**:
- Product list with images, titles, subtitles, prices (original and discounted).
- Badges (e.g., "NEW", "SALE").
- Filtering options (Category, Color, Size, Price).
- Pagination/Infinite Scroll meta data.

**Actions**:
- Filter by attributes → Refreshes product list.
- Search by keyword → Returns matching products.

---

### Product Detail Page
**Purpose**: Detailed view of a single product.

**Data I need to display**:
- Full product details: description, materials, size guide.
- High-res image gallery.
- Inventory status per variant (Size/Color).
- Related products.

---

### Social Feed
**Purpose**: Displaying interactive social proof from platforms like Instagram.

**Data I need to display**:
- List of social posts (video/image).
- Linked product data for each post (title, price, link).
- Engagement metadata (if applicable).

---

### Footer & Newsletter
**Purpose**: Site-wide navigation and lead capture.

**Actions**:
- Subscribe to Newsletter → Save email and return success message.

## Uncertainties
- [ ] How to handle internationalization (multi-currency/language)?
- [ ] Should we support guest checkout?
- [ ] Real-time inventory sync vs. eventual consistency?

## Questions for Backend
- Will there be a single "Product" entity or should we separate "Catalog Item" from "Inventory Item"?
- How will social feed data be ingested (Direct API integrations vs. manual curator tool)?
- What's the preferred way to handle high-resolution image uploads?
