# Better Bite Orlando — API Design and Reference

## Purpose

This document describes the REST API implemented for Better Bite Orlando, a Valencia College Software Development Capstone project.

The backend provides user authentication, recipe information, restaurant searches, location-based food-resource searches, contact form email delivery, and user favorites management.

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

---

## 8. Favorites

The Favorites API allows authenticated users to save and manage
grocery stores, farmers' markets, food pantries, restaurants,
and recipes.

Favorites are stored in MySQL and associated with the
authenticated user's account.

### Authentication

All Favorites endpoints require a valid `bbo_auth` cookie.

Frontend requests must include `credentials: "include"`.

The authenticated user ID is determined by the backend.
A user ID supplied in the request body is not used.

Users can only retrieve and delete their own favorites.

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/favorites` | Retrieve all favorites |
| GET | `/favorites?type=grocery` | Retrieve grocery favorites |
| GET | `/favorites?type=restaurant` | Retrieve restaurant favorites |
| GET | `/favorites?type=recipe` | Retrieve recipe favorites |
| GET | `/favorites/:id` | Retrieve an individual favorite |
| POST | `/favorites` | Save a favorite |
| DELETE | `/favorites/:id` | Remove a favorite |

Favorites are returned in descending creation-date order.

The `:id` parameter represents the internal Favorites database
record ID, not the external provider's item ID.

### POST /favorites

Save an item to the authenticated user's favorites.

#### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| itemType | String | Yes | grocery, restaurant, or recipe |
| itemSubtype | String | No | Grocery resource subtype |
| sourceProvider | String | Yes | External data provider |
| externalItemId | String or integer | Yes | External provider's item ID |
| itemName | String | Yes | Display name or recipe title |
| address | String | No | Location address |
| latitude | Number | No | Location latitude |
| longitude | Number | No | Location longitude |
| imageUrl | String | No | HTTP or HTTPS image URL |

Supported grocery subtypes:

- `grocery-store`
- `farmers-market`
- `food-pantry`

The `itemSubtype` field should be omitted or null for
restaurant and recipe favorites.

#### Example Grocery Favorite Request

```json
{
  "itemType": "grocery",
  "itemSubtype": "grocery-store",
  "sourceProvider": "geoapify",
  "externalItemId": "store123",
  "itemName": "Healthy Market",
  "address": "456 Orange Ave, Orlando, FL",
  "latitude": 28.54,
  "longitude": -81.38
}
```

#### Example Recipe Favorite Request

```json
{
  "itemType": "recipe",
  "sourceProvider": "spoonacular",
  "externalItemId": "634476",
  "itemName": "BBQ Chicken",
  "imageUrl": "https://img.spoonacular.com/recipes/634476-312x231.jpg"
}
```

#### Example Successful Response

HTTP 201 Created

```json
{
  "status": "success",
  "data": {
    "id": 10,
    "itemType": "recipe",
    "itemSubtype": null,
    "sourceProvider": "spoonacular",
    "externalItemId": "634476",
    "itemName": "BBQ Chicken",
    "address": null,
    "latitude": null,
    "longitude": null,
    "imageUrl": "https://img.spoonacular.com/recipes/634476-312x231.jpg",
    "createdAt": "2026-11-25T15:44:44.000Z"
  }
}
```

### GET /favorites

Retrieve the authenticated user's favorites.

The optional `type` query parameter filters the results by
grocery, restaurant, or recipe.

The response contains a `status` field and a `data` array
of favorite objects.

An account without favorites returns:

```json
{
  "status": "success",
  "data": []
}
```

### GET /favorites/:id

Retrieve an individual favorite using its internal database ID.

The response contains the favorite object in the `data` field.

A nonexistent favorite or a favorite owned by another user
returns HTTP 404.

### DELETE /favorites/:id

Remove a favorite using its internal database ID.

#### Example Successful Response

HTTP 200 OK

```json
{
  "status": "success",
  "message": "Favorite removed"
}
```

### Provider Mapping

The following provider values are the standard conventions
for frontend Favorites integration.

| Search Result | itemType | itemSubtype | sourceProvider |
|---|---|---|---|
| Grocery store | grocery | grocery-store | geoapify |
| Farmers' market | grocery | farmers-market | geoapify |
| Food pantry | grocery | food-pantry | feeding-america |
| Restaurant | restaurant | null | geoapify |
| Recipe | recipe | null | spoonacular |

The grocery search response uses `grocery` as its resource
type. Map this value to `grocery-store` when saving a favorite.

The recipe `source` field identifies the recipe publisher,
not the Favorites source provider.

### Search Result Field Mapping

| Favorites Field | Location Search Result | Recipe Search Result |
|---|---|---|
| externalItemId | String(item.id) | String(item.id) |
| itemName | item.name | item.title |
| address | item.address | null |
| latitude | item.latitude | null |
| longitude | item.longitude | null |
| imageUrl | null | item.image |

External identifiers are stored and returned as strings,
including numeric Spoonacular and Feeding America IDs.

Do not enable saving for search results without a valid
identifier or display name.

### Matching Favorites to Search Results

A saved favorite is uniquely identified by the combination of:

- itemType
- sourceProvider
- externalItemId

The frontend should retrieve the user's favorites and match
search results against these three fields.

```javascript
const favorite = favorites.find(
  (saved) =>
    saved.itemType === itemType &&
    saved.sourceProvider === sourceProvider &&
    saved.externalItemId === String(item.id)
);

const isFavorite = Boolean(favorite);
```

Use `favorite.id` when removing a saved favorite.

Do not use the external provider ID in the DELETE endpoint.

### Frontend Request Examples

#### Retrieve Favorites

```javascript
const response = await fetch(
  `${API_BASE_URL}/favorites`,
  { credentials: "include" }
);

if (!response.ok) {
  throw new Error("Unable to retrieve favorites");
}

const result = await response.json();
const favorites = result.data;
```

#### Save a Favorite

```javascript
const response = await fetch(
  `${API_BASE_URL}/favorites`,
  {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(favoritePayload)
  }
);

const result = await response.json();

if (!response.ok) {
  throw new Error(result.error || "Unable to save favorite");
}

const savedFavorite = result.data;
```

#### Remove a Favorite

```javascript
const response = await fetch(
  `${API_BASE_URL}/favorites/${favorite.id}`,
  {
    method: "DELETE",
    credentials: "include"
  }
);

if (!response.ok) {
  throw new Error("Unable to remove favorite");
}
```

### HTTP Status Codes

| Status | Description |
|---|---|
| 200 | Successful retrieval or deletion |
| 201 | Favorite successfully created |
| 400 | Invalid request data, filter, or favorite ID |
| 401 | Missing or invalid authentication |
| 404 | Favorite not found or not owned by the user |
| 409 | Favorite already exists |
| 429 | API rate limit exceeded |
| 500 | Internal server or database error |

### Input Validation

- Required text fields must contain nonempty values.
- External IDs must be strings or safe integers.
- Source provider names cannot exceed 50 characters.
- External IDs and item names cannot exceed 255 characters.
- Addresses cannot exceed 255 characters.
- Image URLs cannot exceed 500 characters.
- Image URLs must use HTTP or HTTPS.
- Latitude must be between -90 and 90.
- Longitude must be between -180 and 180.
- Internal favorite IDs must be positive integers no greater
  than 2147483647.

### Database and Security

Favorites are stored in the `user_favorites` table.

A database unique constraint prevents duplicate favorites
for the same user, item type, source provider, and external ID.

Different users may save the same external item.

Favorites are automatically removed when the associated
user account is deleted.

Saved favorites contain basic display information rather
than complete external provider responses.

The frontend must safely render externally supplied text
and URLs.

### Database Deployment

The database migration is located at:

`backend/database/migrations/001_update_user_favorites.sql`

Back up the target database and verify that the legacy
Favorites table is empty before applying this migration.

If existing favorites are present, prepare a data-preserving
migration instead.

Do not execute the complete development SQL schema against
an existing populated database.
