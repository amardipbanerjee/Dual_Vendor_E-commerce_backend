# E-Commerce Backend API

This project is an e-commerce backend built with Node.js, Express, MongoDB, and Mongoose. It supports three distinct roles—**User**, **Seller**, and **Admin**—and provides endpoints for account management, product handling, orders, payments, and administrative operations.

---

## Table of Contents

- [Overview](#overview)
- [User Flow](#user-flow)
- [Seller Flow](#seller-flow)
- [Admin Flow](#admin-flow)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [License](#license)

---

## Overview

The API supports the following roles:

- **User**:
  - **Account Management**: Create an account, verify email, resend verification emails, and reset passwords.
  - **Browsing & Orders**: Browse categories/products, manage cart and wishlist, place orders, and track orders.
- **Seller**:
  - **Enhanced Verification**: Sellers must provide additional documents (Aadhaar, PAN, GST) and verify their phone via OTP.
  - **Product Management**: Add, update, or delete products; manage inventory; and update product status (published/unpublished).
  - **Order and Financial Management**: View and update orders, process returns/replacements, create withdrawal requests, and view balance details.
- **Admin**:
  - **System Oversight**: Login via a dedicated admin panel.
  - **Dashboard and Reporting**: View dynamic statistics including orders, sales, returns, replacements, cancellations, user/seller counts, and active/inactive seller statuses.
  - **Seller and Order Management**: Approve/deny seller verifications, restrict or delete seller accounts, manage order requests (returns, replacements, cancellations), and review support tickets.

All endpoints (except for initial authentication endpoints) are protected using Passport authentication. Security is enhanced by integrating Helmet, CORS, rate limiting, and session management.

---

## User Flow

1. **Account Creation and Verification:**

   - **Signup**:  
     **Endpoint:** `POST /api/users/signup`  
     **Request Body Example:**
     ```json
     {
       "firstName": "John",
       "lastName": "Doe",
       "email": "john@example.com",
       "phone": "1234567890",
       "password": "password123"
     }
     ```
   - **Email Verification**:  
     **Endpoint:** `GET /api/users/verify-email?token=<verificationToken>`
   - **Resend Verification Email**:  
     **Endpoint:** `POST /api/users/resend-verification`  
     **Request Body Example:**
     ```json
     { "email": "john@example.com" }
     ```
   - **Password Reset Request**:  
     **Endpoint:** `POST /api/users/request-password-reset`  
     **Request Body Example:**
     ```json
     { "email": "john@example.com" }
     ```
   - **Reset Password**:  
     **Endpoint:** `POST /api/users/reset-password`  
     **Request Body Example:**
     ```json
     { "token": "reset-token", "newPassword": "newPassword123" }
     ```

2. **Browsing and Order Management:**
   - **Get Products with Filters**:  
     **Endpoint:** `GET /api/users/products?category=catId&minPrice=100&maxPrice=1000&rating=4&search=phone`
   - **Get Product Details**:  
     **Endpoint:** `GET /api/users/product/:productId`
   - **Cart Operations:**
     - **Add to Cart**: `POST /api/users/cart`
     - **Update Cart Item**: `PUT /api/users/cart`
     - **Remove Cart Item**: `DELETE /api/users/cart`
     - **View Cart**: `GET /api/users/cart`
   - **Wishlist Operations:**
     - **Add to Wishlist**: `POST /api/users/wishlist`
     - **Remove from Wishlist**: `DELETE /api/users/wishlist`
     - **View Wishlist**: `GET /api/users/wishlist`
   - **Place Order**:  
     **Endpoint:** `POST /api/users/order`  
     **Request Body:** Should include an array of items and a shipping address.
   - **Order Details:**
     - **View All Orders**: `GET /api/users/orders`
     - **View Single Order**: `GET /api/users/order/:orderId`
   - **Cancel Order**:  
     **Endpoint:** `POST /api/users/order/cancel`

---

## Seller Flow

1. **Account Creation and Verification:**

   - **Signup**:  
     **Endpoint:** `POST /api/sellers/signup`  
     **Request Body Example:**
     ```json
     {
       "firstName": "Alice",
       "lastName": "Smith",
       "email": "alice@example.com",
       "phone": "0987654321",
       "password": "password123",
       "aadharNumber": "XXXXXXXXXXXX",
       "panNumber": "ABCDE1234F",
       "gstNumber": "22AAAAA0000A1Z5"
     }
     ```
   - **Email Verification**:  
     **Endpoint:** `GET /api/sellers/verify-email?token=<verificationToken>`
   - **Resend Verification Email**:  
     **Endpoint:** `POST /api/sellers/resend-verification`
   - **Password Reset**:  
     **Endpoints:** `POST /api/sellers/request-password-reset` and `POST /api/sellers/reset-password`

2. **Product and Order Management:**
   - **Product Operations:**
     - **Add Product**: `POST /api/sellers/product`
     - **Update Product**: `PUT /api/sellers/product`
     - **Delete Product**: `DELETE /api/sellers/product`
     - **List Products**: `GET /api/sellers/products`
     - **Product Details**: `GET /api/sellers/product/:productId`
   - **Seller Order Operations:**
     - **View Orders**: `GET /api/sellers/orders`
     - **Update Order Status**: `PUT /api/sellers/order/status`
   - **Financial Operations:**
     - **Create Withdrawal Request**: `POST /api/sellers/withdrawal`
     - **View Withdrawal Requests**: `GET /api/sellers/withdrawals`
     - **Check Balance**: `GET /api/sellers/balance`

---

## Admin Flow

1. **Authentication and Dashboard:**

   - **Admin Login**:  
     **Endpoint:** `POST /api/admin/login`  
     **Request Body Example:**
     ```json
     {
       "email": "admin@example.com",
       "password": "adminpassword"
     }
     ```
   - **Dashboard Statistics**:  
     **Endpoint:** `GET /api/admin/dashboard`  
     _Retrieves dynamic statistics including total orders, total sales, returns, replacements, cancellations, user/seller counts, active/inactive seller counts, and support tickets._

2. **Seller Management:**

   - **View All Sellers**: `GET /api/admin/sellers`
   - **Verify a Seller**:  
     **Endpoint:** `POST /api/admin/seller/verify`  
     **Request Body Example:**
     ```json
     { "sellerId": "sellerId" }
     ```
   - **Restrict a Seller**:  
     **Endpoint:** `POST /api/admin/seller/restrict`  
     **Request Body Example:**
     ```json
     { "sellerId": "sellerId" }
     ```
   - **Delete a Seller**:  
     **Endpoint:** `DELETE /api/admin/seller`  
     **Request Body Example:**
     ```json
     { "sellerId": "sellerId" }
     ```

3. **Order Request Management:**

   - **View Order Requests**: `GET /api/admin/order-requests`
   - **Update Order Request Status**:  
     **Endpoint:** `PUT /api/admin/order-request`  
     **Request Body Example:**
     ```json
     { "requestId": "orderRequestId", "status": "Approved" }
     ```

4. **Ticket Management:**
   - **View All Tickets**: `GET /api/admin/tickets`
   - **Update Ticket Status**:  
     **Endpoint:** `PUT /api/admin/ticket/status`  
     **Request Body Example:**
     ```json
     { "ticketId": "ticketId", "status": "Closed" }
     ```

---

## API Endpoints

- **User Endpoints:** `/api/users/*`
- **Seller Endpoints:** `/api/sellers/*`
- **Admin Endpoints:** `/api/admin/*`

> **Note:** All endpoints (except signup and login) require authentication. Use tools like Postman or cURL to send JSON-formatted requests with appropriate headers (e.g., `Content-Type: application/json`).

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# MongoDB Connection URI
MONGO_URI=mongodb://localhost:27017/your-database-name

# Server Port
PORT=5000

# Session Secret for Express sessions
SESSION_SECRET=your-session-secret

# Nodemailer Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false       # Set true if using port 465
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
EMAIL_FROM="No Reply" <noreply@example.com>
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
