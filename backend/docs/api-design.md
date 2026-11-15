# Better Bite Orlando — API Design and Reference

## Purpose

This document describes the REST API implemented for Better Bite Orlando, a Valencia College Software Development Capstone project.

The backend provides user authentication, recipe information, restaurant searches, and location-based food-resource searches.

External API responses are normalized into consistent objects before being returned to the frontend.

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** Prisma
- **Authentication:** HTTP-only cookies
- **Location services:** Geoapify
- **Recipes and nutrition:** Spoonacular
- **Food pantry resources:** Feeding America
- **Transactional email:** SMTP2Go

## API Base URLs

| Environment | Base URL |
|---|---|
| Development | `https://api-dev.betterbiteorlando.com` |
| Testing | Separately configured test API |
| Production | Production API deployment pending |

All endpoint paths below are relative to the API base URL.

---

## 1. Authentication

The authentication endpoints are mounted under `/auth`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate a user |
| POST | `/auth/logout` | Clear the authentication cookie |
| POST | `/auth/forgot-password` | Request a password reset email |
| POST | `/auth/password-reset` | Submit a password reset |
| GET | `/auth/profile` | Retrieve the authenticated user's profile |

Authentication uses an HTTP-only cookie named `bbo_auth`.

Frontend requests requiring authenticated sessions must include credentials.

Example:

```javascript
const response = await fetch(
  `${API_BASE_URL}/auth/profile`,
  { credentials: "include" }
);
```

Authentication request bodies and validation requirements are defined by the corresponding controller implementations.

---

## 2. Recipes

Recipe information is retrieved using Spoonacular and normalized for the frontend.

### GET /recipes

Search for recipes.

The endpoint supports recipe searching and filtering according to the implemented recipe controller.

### GET /recipes/:id

Retrieve detailed information for a recipe using its Spoonacular recipe ID.

The detailed response may include nutritional information, dietary properties, and preparation instructions.

### Example Normalized Recipe

```json
{
  "id": 101,
  "title": "Healthy Chicken Bowl",
  "image": "https://example.com/chicken.jpg",
  "readyInMinutes": 30,
  "source": "Example Recipe Source",
  "healthScore": 90,
  "nutrition": {
    "calories": 450,
    "protein": 35,
    "carbs": 40,
    "fat": 12,
    "saturatedFat": null,
    "sugar": 6
  },
  "instructions": [
    {
      "number": 1,
      "step": "Cook the chicken."
    }
  ],
  "dietary": {
    "vegetarian": false,
    "vegan": false,
    "glutenFree": true,
    "ketogenic": false
  }
}
```

This is an illustrative normalized object, not a guaranteed response for every recipe or endpoint.

Recipe creation, updating, and deletion are not exposed by the current recipe router.

---

## 3. Restaurants

### GET /places/restaurants

Retrieve restaurant locations through Geoapify.

Restaurant information is normalized before being returned to the frontend.

### Example Restaurant Object

```json
{
  "id": "restaurant123",
  "name": "Healthy Cafe",
  "address": "123 Main St, Orlando, FL",
  "latitude": 28.5,
  "longitude": -81.3,
  "website": "https://example.com",
  "openingHours": "Mo-Fr 09:00-21:00",
  "cuisine": "healthy",
  "dietaryOptions": ["vegan", "vegetarian"],
  "menuUrl": null
}
```

This example illustrates the normalized fields. Actual values depend on Geoapify's available location data.

---

## 4. Food Resources

### GET /places/groceries

This endpoint searches for grocery stores, farmers' markets, and food pantries.

Multiple resource categories can be requested in a single call.

### Query Parameters

| Parameter | Description |
|---|---|
| `types` | Comma-separated resource categories |
| `location` | ZIP code or address |
| `zip` | Alternative ZIP-code input |
| `lat` | Search origin latitude |
| `lon` | Search origin longitude |
| `maxDistance` | Maximum distance in miles |
| `limit` | Geoapify result limit |
| `category` | Optional grocery Geoapify category |
| `conditions` | Optional Geoapify conditions parameter |

Supported resource categories:

- `groceries`
- `farmers-markets`
- `food-pantries`

### Example Request

```http
GET /places/groceries?types=groceries,farmers-markets,food-pantries&location=32801&maxDistance=30
```

### Example Grocery Object

```json
{
  "id": "store123",
  "name": "Healthy Market",
  "address": "456 Orange Ave, Orlando, FL",
  "latitude": 28.54,
  "longitude": -81.38,
  "website": "https://example.com",
  "openingHours": "Mo-Sa 08:00-22:00",
  "categories": ["commercial.supermarket"],
  "type": "grocery",
  "distanceMiles": 2.4
}
```

### Farmers' Markets

Farmers' market searches use Geoapify's `commercial.marketplace` category.

The backend performs separate name searches.

Results are combined and deduplicated using Geoapify place IDs.

The backend returns these locations using the existing `farmers-market` type.

Inclusion in search results does not guarantee produce availability.

### Food Pantries

Food pantry information is retrieved through Feeding America and normalized by the backend.

The normalized object may include:

- ID
- Name
- Description
- Address
- Latitude and longitude
- URL
- Associated organizations
- Resource type

### Provider Failure Handling

The combined food-resource endpoint uses independent provider requests.

If one provider fails, successful results from other providers can still be returned.

If all requested providers fail, the endpoint returns an error.

The current endpoint returns a combined array and does not necessarily report partial provider failures to the frontend.

---

## 5. Location and Distance Filtering

Location-based searches support ZIP codes, addresses, or latitude and longitude.

Geoapify provides forward geocoding for textual locations.

Distances are expressed in miles in the Better Bite Orlando API.

Geoapify's circular geographic filters use meters, so the backend converts miles to meters when constructing requests.

The backend also calculates distances between the search origin and returned location coordinates.

---

## 6. Data Normalization

The backend normalization utilities provide consistent response fields across external data providers.

The implementation includes normalizers for:

- Restaurants
- Recipes
- Grocery stores
- Farmers' markets
- Food pantries

Normalization helps keep frontend components independent of third-party API response formats.

Some fields may be null or unavailable when the external provider does not supply the information.

---

## 7. Error Handling and Security

The API includes:

- Input validation
- Authentication handling
- Rate-limiting middleware
- Server-side external API credentials
- HTTP status codes and JSON error responses
- Independent handling of food-resource provider failures

API keys and other credentials are stored in environment configuration and must not be committed to GitHub.

Authentication cookies and CORS configuration are managed by the Express backend.
