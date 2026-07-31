# 📚 DAWN ESTATE - API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## 🔐 Authentication Endpoints

### Register
**POST** `/auth/register`

Create a new user account.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+212 6XX XXX XXX" // optional
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

---

### Login
**POST** `/auth/login`

Authenticate a user and get access token.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

---

### Get Current User
**GET** `/auth/me`

Get authenticated user information.

**Headers:** Requires Authorization

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

---

## 🏠 Property Endpoints

### Get All Properties
**GET** `/properties`

Get list of properties with optional filters.

**Query Parameters:**
- `category` - villa | house | apartment | studio | land
- `prestation` - sale | rent
- `city` - string
- `minPrice` - number
- `maxPrice` - number
- `pool` - true | false
- `status` - all (shows pending properties for admin)

**Example:**
```
GET /properties?category=villa&prestation=sale&city=Casablanca&pool=true
```

**Response:**
```json
{
  "properties": [
    {
      "id": "uuid",
      "category": "villa",
      "prestation": "sale",
      "city": "Casablanca",
      "surface": 500,
      "address": "Boulevard Anfa",
      "bedrooms": 5,
      "bathrooms": 4,
      "pool": true,
      "price": 5000000,
      "images": ["url1", "url2"],
      "videos": ["url1"],
      "status": "approved",
      "createdAt": "2024-01-31T10:00:00Z"
    }
  ]
}
```

---

### Get Property by ID
**GET** `/properties/:id`

Get details of a specific property.

**Response:**
```json
{
  "property": {
    "id": "uuid",
    "category": "villa",
    // ... full property object
  }
}
```

---

### Create Property
**POST** `/properties`

Create a new property listing (requires authentication).

**Headers:** Requires Authorization

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "category": "villa",
  "prestation": "sale",
  "city": "Casablanca",
  "surface": 500,
  "address": "Boulevard Anfa",
  "bedrooms": 5,
  "bathrooms": 4,
  "pool": true,
  "price": 5000000,
  "images": ["signedUrl1", "signedUrl2"],
  "videos": ["signedUrl1"]
}
```

**Response:**
```json
{
  "success": true,
  "property": {
    "id": "uuid",
    "status": "pending",
    // ... full property object
  }
}
```

---

### Update Property Status (Admin Only)
**PUT** `/properties/:id/status`

Approve or reject a property listing.

**Headers:** Requires Authorization (Admin)

**Body:**
```json
{
  "status": "approved" // or "rejected" or "pending"
}
```

**Response:**
```json
{
  "success": true,
  "property": {
    // ... updated property
  }
}
```

---

### Delete Property
**DELETE** `/properties/:id`

Delete a property (admin or owner only).

**Headers:** Requires Authorization

**Response:**
```json
{
  "success": true
}
```

---

## 📊 Estimation Endpoints

### Create Estimation Request
**POST** `/estimations`

Submit a property estimation request (no auth required).

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+212 6XX XXX XXX",
  "propertyType": "villa",
  "city": "Casablanca",
  "surface": 300,
  "message": "I would like an estimation...",
  "images": ["signedUrl1"],
  "videos": []
}
```

**Response:**
```json
{
  "success": true,
  "estimation": {
    "id": "uuid",
    // ... full estimation object
  }
}
```

---

### Get All Estimations (Admin Only)
**GET** `/estimations`

Get all estimation requests.

**Headers:** Requires Authorization (Admin)

**Response:**
```json
{
  "estimations": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "propertyType": "villa",
      "city": "Casablanca",
      "createdAt": "2024-01-31T10:00:00Z"
    }
  ]
}
```

---

### Delete Estimation (Admin Only)
**DELETE** `/estimations/:id`

Delete an estimation request.

**Headers:** Requires Authorization (Admin)

**Response:**
```json
{
  "success": true
}
```

---

## 📁 File Upload Endpoint

### Upload File
**POST** `/upload`

Upload an image or video file.

**Headers:** 
- Requires Authorization
- Content-Type: multipart/form-data

**FormData:**
- `file` - File object
- `bucket` - make-d093e79c-properties | make-d093e79c-estimations

**Response:**
```json
{
  "success": true,
  "path": "userId/uuid.jpg",
  "url": "signedUrl (valid for 1 year)"
}
```

**Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('file', fileObject);
formData.append('bucket', 'make-d093e79c-properties');

const response = await fetch(`${API_URL}/upload`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

---

## 👥 Admin Endpoints

### Get All Users (Admin Only)
**GET** `/admin/users`

Get list of all users.

**Headers:** Requires Authorization (Admin)

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+212...",
      "role": "user",
      "createdAt": "2024-01-31T10:00:00Z"
    }
  ]
}
```

---

### Update User Role (Admin Only)
**PUT** `/admin/users/:id/role`

Change a user's role.

**Headers:** Requires Authorization (Admin)

**Body:**
```json
{
  "role": "admin" // or "user"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    // ... updated user
  }
}
```

---

### Get Dashboard Statistics (Admin Only)
**GET** `/admin/stats`

Get dashboard statistics.

**Headers:** Requires Authorization (Admin)

**Response:**
```json
{
  "stats": {
    "totalUsers": 42,
    "totalProperties": 120,
    "pendingProperties": 15,
    "approvedProperties": 100,
    "totalEstimations": 35
  }
}
```

---

## 🔒 Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Property not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create property"
}
```

---

## 📝 Notes

- All dates are in ISO 8601 format
- Prices are in MAD (Moroccan Dirham)
- Surface is in square meters (m²)
- Images and videos must be uploaded via `/upload` endpoint first
- Signed URLs are valid for 1 year
- Properties are pending by default and need admin approval

---

## 🎯 Property Status Flow

1. User creates property → status: "pending"
2. Admin reviews in dashboard
3. Admin approves → status: "approved" (visible to public)
4. Admin rejects → status: "rejected" (not visible)

---

**Default Admin Account:**
```
Email: admin@dawnestate.com
Password: Admin@2024!
```

---

© 2024 Dawn Estate API Documentation
