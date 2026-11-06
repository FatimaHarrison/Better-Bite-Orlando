# Better Bite Orlando - API Endpoint Design

## Purpose

This document defines the planned API response structure for Better Bite Orlando. It is intended to keep the frontend, backend, database, and external API data aligned.

External API responses will be normalized before being returned to the frontend so the frontend receives a consistent data format.

---

## Meals

### GET /meals

Returns all meals.

Optional query parameters:

- `category` - Filter meals by category
- `restaurantId` - Filter meals by restaurant
- `dietary` - Filter meals by dietary type
- `search` - Search meals by name

Example:

```http
GET /meals?dietary=vegan
```

### GET /meals/:id

Returns a single meal by its ID.

Example response:

```json
{
  "id": 1,
  "name": "Grilled Chicken Bowl",
  "restaurant": {
    "id": 1,
    "name": "Example Restaurant"
  },
  "price": 12.99,
  "nutrition": {
    "calories": 450,
    "protein": 35,
    "carbs": 40,
    "fat": 12
  },
  "dietary": ["high-protein"],
  "category": "lunch",
  "location": {
    "address": "123 Main St, Orlando, FL",
    "lat": 28.5,
    "lon": -81.3,
    "distanceMiles": 2.4
  },
  "rating": 4.5
}
```

---

## Restaurants

Restaurant data may come from an external location API and will be normalized before being sent to the frontend.

Planned restaurant response:

```json
{
  "id": "restaurant123",
  "name": "Healthy Cafe",
  "address": "123 Main St, Orlando, FL",
  "latitude": 28.5,
  "longitude": -81.3,
  "website": "https://example.com",
  "openingHours": "9AM-9PM",
  "cuisine": "healthy",
  "dietaryOptions": [
    "vegan",
    "vegetarian"
  ]
}
```

### Database alignment

The current Restaurant database model contains:

- `id`
- `name`

The external API may additionally provide:

- address
- latitude
- longitude
- website
- opening hours
- cuisine
- dietary options

These additional fields should be reviewed with the database and frontend teams before deciding whether they should be stored in the database or returned only from the external API.

---

## Recipes

Recipe data retrieved from the external recipe API will be normalized before being returned to the frontend.

Example normalized response:

```json
{
  "id": 101,
  "title": "Healthy Chicken Bowl",
  "image": "chicken.jpg",
  "readyInMinutes": 30,
  "source": "Better Bite",
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
      "step": "Cook the chicken"
    },
    {
      "number": 2,
      "step": "Assemble the bowl"
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

Current recipe routes include operations for retrieving, creating, updating, and deleting recipes.

The external API recipe format and the application's stored Recipe model should remain separate when appropriate. External recipe responses can be normalized for frontend use without requiring every external field to be stored in the database.

---

## Grocery / Supermarket Locations

Grocery and supermarket data may be retrieved from a location API and normalized into the following structure:

```json
{
  "id": "store123",
  "name": "Healthy Market",
  "address": "456 Orange Ave, Orlando, FL",
  "latitude": 28.54,
  "longitude": -81.38,
  "website": "https://example.com",
  "openingHours": "8AM-10PM",
  "categories": [
    "commercial.supermarket"
  ]
}
```

The frontend can use this information to display nearby grocery locations based on the user's location or ZIP code.

---

## Fields Requiring Team Confirmation

Before final API integration, the frontend, backend, and database teams should confirm:

1. Which restaurant fields need to be stored in MySQL versus retrieved dynamically from the external API.
2. Which recipe fields the frontend needs to display.
3. Whether grocery locations need to be stored or retrieved dynamically.
4. Standard dietary values used throughout the application.
5. Standard meal category values.
6. Final route naming and API prefixes.
7. Whether multiple meal filters should be supported at the same time.

---

## Normalization

External APIs may return different field names and nested structures.

The backend normalization service converts external responses into consistent Better Bite Orlando objects for:

- Restaurants
- Recipes
- Grocery / supermarket locations

This prevents the frontend from depending directly on the response format of individual third-party APIs.