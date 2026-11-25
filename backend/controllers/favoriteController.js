import prisma from "../lib/prisma.js";

const VALID_ITEM_TYPES = ["grocery", "restaurant", "recipe"];
const VALID_GROCERY_SUBTYPES = [
  "grocery-store",
  "farmers-market",
  "food-pantry",
];

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const cleanOptionalString = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  return value.trim() || null;
};

const isOptionalString = (value) =>
  value === undefined || value === null || typeof value === "string";

const isOptionalCoordinate = (value) =>
  value === undefined ||
  value === null ||
  value === "" ||
  typeof value === "number" ||
  (typeof value === "string" && value.trim() !== "");

const isValidHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const formatFavorite = (favorite) => ({
  id: favorite.favorite_id,
  itemType: favorite.item_type,
  itemSubtype: favorite.item_subtype,
  sourceProvider: favorite.source_provider,
  externalItemId: favorite.external_item_id,
  itemName: favorite.item_name,
  address: favorite.address,
  latitude: favorite.latitude === null ? null : Number(favorite.latitude),
  longitude: favorite.longitude === null ? null : Number(favorite.longitude),
  imageUrl: favorite.image_url,
  createdAt: favorite.created_at,
});

// GET /favorites
// GET /favorites?type=grocery
export const getFavorites = async (req, res) => {
  try {
    const { type } = req.query;

    if (type && !VALID_ITEM_TYPES.includes(type)) {
      return res.status(400).json({
        status: "error",
        error: "Invalid favorite type",
      });
    }

    const favorites = await prisma.user_favorites.findMany({
      where: {
        user_id: req.userId,
        ...(type ? { item_type: type } : {}),
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return res.status(200).json({
      status: "success",
      data: favorites.map(formatFavorite),
    });
  } catch (error) {
    console.error("Failed to retrieve favorites:", error);

    return res.status(500).json({
      status: "error",
      error: "Unable to retrieve favorites",
    });
  }
};

// GET /favorites/:id
export const getFavoriteById = async (req, res) => {
  try {
    const favoriteId = Number(req.params.id);

    if (
      !Number.isInteger(favoriteId) ||
      favoriteId <= 0 ||
      favoriteId > 2147483647
    ) {
      return res.status(400).json({
        status: "error",
        error: "Invalid favorite ID",
      });
    }

    const favorite = await prisma.user_favorites.findFirst({
      where: {
        favorite_id: favoriteId,
        user_id: req.userId,
      },
    });

    if (!favorite) {
      return res.status(404).json({
        status: "error",
        error: "Favorite not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: formatFavorite(favorite),
    });
  } catch (error) {
    console.error("Failed to retrieve favorite:", error);

    return res.status(500).json({
      status: "error",
      error: "Unable to retrieve favorite",
    });
  }
};

// POST /favorites
export const createFavorite = async (req, res) => {
  try {
    const {
      itemType,
      itemSubtype,
      sourceProvider,
      externalItemId,
      itemName,
      address,
      latitude,
      longitude,
      imageUrl,
    } = req.body ?? {};

    if (
      !isOptionalString(itemSubtype) ||
      !isOptionalString(address) ||
      !isOptionalString(imageUrl)
    ) {
      return res.status(400).json({
        status: "error",
        error: "Optional text fields must be strings",
      });
    }

    if (
      typeof externalItemId !== "string" &&
      !Number.isSafeInteger(externalItemId)
    ) {
      return res.status(400).json({
        status: "error",
        error: "externalItemId must be a string or integer",
      });
    }

    if (!isOptionalCoordinate(latitude) || !isOptionalCoordinate(longitude)) {
      return res.status(400).json({
        status: "error",
        error: "Coordinates must be numeric values",
      });
    }

    if (!VALID_ITEM_TYPES.includes(itemType)) {
      return res.status(400).json({
        status: "error",
        error: "Invalid favorite type",
      });
    }

    if (!isNonEmptyString(sourceProvider)) {
      return res.status(400).json({
        status: "error",
        error: "sourceProvider is required",
      });
    }

    if (
      externalItemId === undefined ||
      externalItemId === null ||
      String(externalItemId).trim() === ""
    ) {
      return res.status(400).json({
        status: "error",
        error: "externalItemId is required",
      });
    }

    if (!isNonEmptyString(itemName)) {
      return res.status(400).json({
        status: "error",
        error: "itemName is required",
      });
    }

    if (
      itemType === "grocery" &&
      itemSubtype &&
      !VALID_GROCERY_SUBTYPES.includes(itemSubtype)
    ) {
      return res.status(400).json({
        status: "error",
        error: "Invalid grocery subtype",
      });
    }

    if (itemType !== "grocery" && itemSubtype) {
      return res.status(400).json({
        status: "error",
        error: "itemSubtype is only supported for grocery favorites",
      });
    }

    const parsedLatitude =
      latitude === undefined || latitude === null || latitude === ""
        ? null
        : Number(latitude);

    const parsedLongitude =
      longitude === undefined || longitude === null || longitude === ""
        ? null
        : Number(longitude);

    if (
      parsedLatitude !== null &&
      (!Number.isFinite(parsedLatitude) ||
        parsedLatitude < -90 ||
        parsedLatitude > 90)
    ) {
      return res.status(400).json({
        status: "error",
        error: "Invalid latitude",
      });
    }

    if (
      parsedLongitude !== null &&
      (!Number.isFinite(parsedLongitude) ||
        parsedLongitude < -180 ||
        parsedLongitude > 180)
    ) {
      return res.status(400).json({
        status: "error",
        error: "Invalid longitude",
      });
    }

    const provider = sourceProvider.trim();
    const externalId = String(externalItemId).trim();
    const name = itemName.trim();

    if (provider.length > 50) {
      return res.status(400).json({
        status: "error",
        error: "sourceProvider is too long",
      });
    }

    if (externalId.length > 255) {
      return res.status(400).json({
        status: "error",
        error: "externalItemId is too long",
      });
    }

    if (name.length > 255) {
      return res.status(400).json({
        status: "error",
        error: "itemName is too long",
      });
    }

    const cleanedAddress = cleanOptionalString(address);
    const cleanedImageUrl = cleanOptionalString(imageUrl);

    if (cleanedImageUrl && !isValidHttpUrl(cleanedImageUrl)) {
      return res.status(400).json({
        status: "error",
        error: "imageUrl must be a valid HTTP or HTTPS URL",
      });
    }

    if (cleanedAddress && cleanedAddress.length > 255) {
      return res.status(400).json({
        status: "error",
        error: "address is too long",
      });
    }

    if (cleanedImageUrl && cleanedImageUrl.length > 500) {
      return res.status(400).json({
        status: "error",
        error: "imageUrl is too long",
      });
    }

    const existingFavorite = await prisma.user_favorites.findFirst({
      where: {
        user_id: req.userId,
        item_type: itemType,
        source_provider: provider,
        external_item_id: externalId,
      },
    });

    if (existingFavorite) {
      return res.status(409).json({
        status: "error",
        error: "Favorite already exists",
      });
    }

    const favorite = await prisma.user_favorites.create({
      data: {
        user_id: req.userId,
        item_type: itemType,
        item_subtype:
          itemType === "grocery" ? cleanOptionalString(itemSubtype) : null,
        source_provider: provider,
        external_item_id: externalId,
        item_name: name,
        address: cleanedAddress,
        latitude: parsedLatitude,
        longitude: parsedLongitude,
        image_url: cleanedImageUrl,
      },
    });

    return res.status(201).json({
      status: "success",
      data: formatFavorite(favorite),
    });
  } catch (error) {
    // The database unique constraint also protects against
    // simultaneous duplicate save requests.
    if (error?.code === "P2002") {
      return res.status(409).json({
        status: "error",
        error: "Favorite already exists",
      });
    }

    console.error("Failed to create favorite:", error);

    return res.status(500).json({
      status: "error",
      error: "Unable to create favorite",
    });
  }
};

// DELETE /favorites/:id
export const deleteFavorite = async (req, res) => {
  try {
    const favoriteId = Number(req.params.id);

    if (
      !Number.isInteger(favoriteId) ||
      favoriteId <= 0 ||
      favoriteId > 2147483647
    ) {
      return res.status(400).json({
        status: "error",
        error: "Invalid favorite ID",
      });
    }

    const result = await prisma.user_favorites.deleteMany({
      where: {
        favorite_id: favoriteId,
        user_id: req.userId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        status: "error",
        error: "Favorite not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Favorite removed",
    });
  } catch (error) {
    console.error("Failed to delete favorite:", error);

    return res.status(500).json({
      status: "error",
      error: "Unable to delete favorite",
    });
  }
};
