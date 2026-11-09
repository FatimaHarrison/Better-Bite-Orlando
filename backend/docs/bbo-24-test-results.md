# BBO-24 Backend API Test Results

**Task:** Test missing values, rate limits, and failure cases  
**Tester:** Zekia Beyene  
**Date:** November 5, 2026  
**Branch:** feature/get-api

## Test Environment

- Backend: Node.js / Express
- Local API: http://127.0.0.1:3001
- Testing method: curl
- Endpoint group tested: Meals API

---

## Test 1: GET All Meals - Baseline

**Endpoint:** GET /meals

**Command:**
curl.exe -i http://127.0.0.1:3001/meals

**Expected Result:**
The API should return HTTP 200 and a JSON array containing the available meals.

**Actual Result:**
The API returned HTTP 200 OK and successfully returned the meal dataset as JSON.

**Status:** PASS

**Notes:**
This confirms that the Meals API is running successfully before failure-case testing begins.
## Test 2: Invalid Meal ID

**Endpoint:** GET /meals/:id

**Command:**
curl.exe -i http://127.0.0.1:3001/meals/abc

**Test Scenario:**
A non-numeric value was provided as the meal ID.

**Expected Result:**
The API should reject the invalid ID without crashing and return HTTP 400 Bad Request.

**Actual Result:**
The API returned HTTP 400 Bad Request with the following JSON response:

{"error":"Invalid meal ID"}

**Status:** PASS

**Notes:**
The endpoint correctly validates the meal ID before attempting to retrieve a meal. Invalid non-numeric IDs are handled gracefully and return a clear error response.
## Test 3: Nonexistent Meal ID

**Endpoint:** GET /meals/:id

**Command:**
curl.exe -i http://127.0.0.1:3001/meals/99999

**Test Scenario:**
A valid numeric meal ID was provided, but no meal exists with that ID.

**Expected Result:**
The API should return HTTP 404 Not Found and provide a clear error message without crashing the server.

**Actual Result:**
The API returned HTTP 404 Not Found with the following JSON response:

{"error":"Meal not found"}

**Status:** PASS

**Notes:**
This confirms that the API correctly handles requests for meal IDs that are valid integers but do not correspond to an existing meal. The endpoint distinguishes a nonexistent resource from an invalid meal ID and returns the appropriate HTTP status code.
## Test 4: Empty Search Parameter

**Endpoint:** GET /meals?search=

**Command:**
curl.exe -i "http://127.0.0.1:3001/meals?search="

**Test Scenario:**
The search query parameter was included in the request, but no search value was provided.

**Expected Result:**
The API should handle the missing search value without crashing or returning a server error.

**Actual Result:**
The API returned HTTP 200 OK. Because the search value was empty, the request fell back to the default meal retrieval behavior and returned the complete meal dataset.

**Status:** PASS

**Notes:**
The API safely handles an empty search parameter. No exception or server failure occurred. The current implementation treats an empty search value as equivalent to requesting all meals. This behavior may be reviewed later if the team decides that empty search parameters should instead return a validation error.
## Test 5: Dietary Filter With No Matches

**Endpoint:** GET /meals?dietary=doesnotexist

**Command:**
curl.exe -i "http://127.0.0.1:3001/meals?dietary=doesnotexist"

**Test Scenario:**
A dietary filter value was provided that does not match any meals in the current dataset.

**Expected Result:**
The API should handle the request without crashing and return an empty result set when no meals match the dietary value.

**Actual Result:**
The API returned HTTP 200 OK with an empty JSON array:

[]

**Status:** PASS

**Notes:**
The dietary filtering functionality correctly handles a valid request that produces zero matching records. The API returns an empty array rather than generating an error, allowing the frontend to safely recognize that no meals matched the requested dietary filter.
## Test 6: Category Filter With No Matches

**Endpoint:** GET /meals?category=doesnotexist

**Command:**
curl.exe -i "http://127.0.0.1:3001/meals?category=doesnotexist"

**Test Scenario:**
A category value was provided that does not match any meals in the current dataset.

**Expected Result:**
The API should process the request without crashing and return an empty result set when no meals match the requested category.

**Actual Result:**
The API returned HTTP 200 OK with an empty JSON array:

[]

**Status:** PASS

**Notes:**
The category filtering functionality correctly handles a request containing a category that does not exist in the current dataset. Instead of producing a server error or invalid response, the endpoint safely returns an empty array, allowing the frontend to handle a no-results condition appropriately.
## Test 7: Valid Category Filter

**Endpoint:** GET /meals?category=Bowl

**Command:**
curl.exe -i "http://127.0.0.1:3001/meals?category=Bowl"

**Test Scenario:**
A valid category value was provided that matches meals in the current dataset.

**Expected Result:**
The API should return HTTP 200 OK and return the meals matching the requested Bowl category.

**Actual Result:**
The API returned HTTP 200 OK and successfully returned meal records with the category set to "Bowl".

**Status:** PASS

**Notes:**
This test confirms that category filtering works successfully when matching records exist. Combined with the previous no-match category test, the endpoint has demonstrated that it can safely handle both successful category searches and category values that return no results.
## Test 8: Invalid Restaurant ID

**Endpoint:** GET /meals?restaurantId=abc

**Command:**
curl.exe -i "http://127.0.0.1:3001/meals?restaurantId=abc"

**Test Scenario:**
A non-numeric value was provided for the restaurantId query parameter.

**Expected Result:**
The API should validate the restaurant ID and return HTTP 400 Bad Request because the supplied restaurant ID is invalid.

**Actual Result:**
The API returned HTTP 500 Internal Server Error with the following response:

{"error":"Unable to retrieve meals"}

**Status:** ISSUE FOUND

**Issue Identified:**
The restaurantId query parameter is not currently validated before being passed to the repository/database layer. Invalid input therefore results in an internal server error instead of a client validation error.

**Recommended Fix:**
Validate restaurantId before querying the repository. If the value is not a positive integer, return HTTP 400 Bad Request with a clear error message such as "Invalid restaurant ID".
## Test: Invalid Restaurant ID

**Command:**
curl.exe -i "http://127.0.0.1:3001/meals?restaurantId=abc"

**Expected Result:**
The API should reject a non-numeric restaurant ID and return HTTP 400 Bad Request.

**Actual Result:**
The API returned HTTP 400 Bad Request with:

`{"error":"Invalid restaurant ID"}`

**Status:** PASS

**Notes:**
Confirms that invalid restaurant IDs are validated before being sent to the repository/database layer.
## Test: Valid Restaurant ID Filter

**Command:**
curl.exe -i "http://127.0.0.1:3001/meals?restaurantId=5"

**Expected Result:**
The API should return HTTP 200 OK and only meals belonging to restaurant ID 5.

**Actual Result:**
The API returned HTTP 200 OK and returned only meals from Fresh Kitchen with restaurant ID 5.

**Status:** PASS

**Notes:**
Confirms that the restaurant ID filter works correctly for a valid numeric restaurant ID.
## Test: Nonexistent Restaurant ID

**Command:**
curl.exe -i "http://127.0.0.1:3001/meals?restaurantId=99999"

**Expected Result:**
The API should return HTTP 200 OK with an empty array because the restaurant ID is valid in format but has no matching meals.

**Actual Result:**
The API returned HTTP 200 OK with an empty array.

`[]`

**Status:** PASS

**Notes:**
Confirms that a valid numeric restaurant ID with no matching meals is handled without producing an error.
## Test: Meal Name Search

**Command:**
curl.exe -i "http://127.0.0.1:3001/meals?search=chicken"

**Expected Result:**
The API should return HTTP 200 OK and only meals whose names contain "chicken".

**Actual Result:**
The API returned HTTP 200 OK and returned meals containing "Chicken" in their names.

**Status:** PASS

**Notes:**
Confirms that meal-name search correctly returns matching meals and is case-insensitive.
## Test: Dietary Filter

**Command:**
curl.exe -i "http://127.0.0.1:3001/meals?dietary=gluten-free"

**Expected Result:**
The API should return HTTP 200 OK and only meals containing "gluten-free" in their dietary options.

**Actual Result:**
The API returned HTTP 200 OK and returned only meals containing "gluten-free" in their dietary arrays.

**Status:** PASS

**Notes:**
Confirms that dietary filtering correctly returns meals matching the requested dietary type.
The filter was also tested with "GLUTEN-FREE" and returned the same results, confirming that dietary filtering is case-insensitive.
The filter was also tested with lowercase "bowl" and returned the same results as "Bowl", confirming that category filtering is case-insensitive.
## Test: Combined Restaurant and Dietary Filters

**Command:**
curl.exe -i "http://127.0.0.1:3001/meals?restaurantId=5&dietary=gluten-free"

**Expected Result:**
The API should return HTTP 200 OK and only meals that belong to restaurant ID 5 and contain "gluten-free" in their dietary options.

**Actual Result:**
The API returned HTTP 200 OK, but returned all meals belonging to restaurant ID 5, including a meal that does not contain "gluten-free" in its dietary options.

**Status:** FAIL

**Notes:**
The current controller uses an if/else-if chain for query filters, so only the first matching filter is applied. Combined query filters are not currently supported.
### Retest After Fix

**Command:**
curl.exe -i "http://127.0.0.1:3001/meals?restaurantId=5&dietary=gluten-free"

**Actual Result:**
The API returned HTTP 200 OK and returned only the Grilled Chicken Bowl, which belongs to restaurant ID 5 and contains "gluten-free" in its dietary options.

**Status:** PASS

**Fix Applied:**
Updated the meal filtering logic so that multiple query parameters are applied sequentially instead of using an if/else-if chain. This allows combined filters to work together.

**Notes:**
The original test returned all meals from restaurant ID 5 because only the restaurant filter was being applied. After the fix, both the restaurant and dietary filters are applied correctly.
## Test: Multiple Combined Filters

**Command:**
curl.exe -i "http://127.0.0.1:3001/meals?restaurantId=5&dietary=gluten-free&category=Bowl&search=chicken"

**Expected Result:**
The API should return HTTP 200 OK and only meals that satisfy all four query parameters: restaurant ID 5, dietary type "gluten-free", category "Bowl", and a meal name containing "chicken".

**Actual Result:**
The API returned HTTP 200 OK and returned only the Grilled Chicken Bowl, which satisfies all four requested filters.

**Status:** PASS

**Notes:**
Confirms that restaurant, dietary, category, and name-search filters can be combined and applied simultaneously.
## Test: Protected POST /meals - Missing API Key

**Command:**
curl.exe -i -X POST "http://127.0.0.1:3001/meals"

**Expected Result:**
The API should reject the request and return HTTP 401 Unauthorized because no API key was provided.

**Actual Result:**
The API returned HTTP 401 Unauthorized with:

`{"error":"API key is required"}`

**Status:** PASS

**Notes:**
Confirms that the POST /meals route is protected and cannot be accessed without an API key.

---

## Test: Protected POST /meals - Invalid API Key

**Command:**
curl.exe -i -X POST "http://127.0.0.1:3001/meals" -H "x-api-key: definitely-wrong-key"

**Expected Result:**
The API should reject an incorrect API key and return HTTP 403 Forbidden.

**Actual Result:**
The API returned HTTP 403 Forbidden with:

`{"error":"Invalid API key"}`

**Status:** PASS

**Notes:**
Confirms that the API-key middleware rejects invalid credentials.

---

## Test: Protected POST /meals - Valid API Key

**Command:**
POST /meals with a valid x-api-key header.

**Expected Result:**
The API should accept a valid API key and return HTTP 200 OK.

**Actual Result:**
The API returned HTTP 200 OK with:

`{"message":"Protected POST meal route accessed successfully"}`

**Status:** PASS

**Notes:**
Confirms that authenticated requests can successfully access the protected POST /meals route. The API key itself is intentionally omitted from this test document.
---

## Test: API Rate Limiting

**Command:**
Sent repeated GET requests to `/meals` to exceed the configured request limit.

**Configuration:**
- Request limit: 100 requests
- Time window: 15 minutes
- Expected limit response: HTTP 429 Too Many Requests

**Expected Result:**
Requests within the allowed limit should return HTTP 200 OK. Once the request limit is exceeded, the API should reject additional requests with HTTP 429 Too Many Requests.

**Actual Result:**
Requests within the configured limit returned HTTP 200 OK. After the rate limit was reached, additional requests returned HTTP 429 with:

`{"error":"Too many requests","message":"Please try again later."}`

**Status:** PASS

**Notes:**
Confirms that the Express rate-limiting middleware successfully prevents excessive requests. Requests are limited to 100 per client within a 15-minute window.