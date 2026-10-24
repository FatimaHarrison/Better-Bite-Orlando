import "dotenv/config";
import fs from "fs";
import prisma from "../lib/prisma.js";

const mockData = JSON.parse(
    fs.readFileSync(new URL("../mockdata/mockdata.json", import.meta.url), "utf-8")
);

async function main() {
    // Clear existing data so the seed can be run again safely
    await prisma.location.deleteMany();
    await prisma.nutrition.deleteMany();
    await prisma.meal.deleteMany();
    await prisma.restaurant.deleteMany();

    for (const item of mockData) {
        // Create the restaurant if it does not already exist
        const restaurant = await prisma.restaurant.upsert({
            where: {
                id: item.restaurant.id,
            },
            update: {
                name: item.restaurant.name,
            },
            create: {
                id: item.restaurant.id,
                name: item.restaurant.name,
            },
        });

        // Create the meal and its related nutrition/location records
        await prisma.meal.create({
            data: {
                id: item.id,
                name: item.name,
                price: item.price,
                dietary: item.dietary,
                category: item.category,
                rating: item.rating,
                restaurantId: restaurant.id,

                nutrition: {
                    create: {
                        calories: item.nutrition.calories,
                        protein: item.nutrition.protein,
                        carbs: item.nutrition.carbs,
                        fat: item.nutrition.fat,
                    },
                },

                location: {
                    create: {
                        address: item.location.address,
                        lat: item.location.lat,
                        lon: item.location.lon,
                        distance_miles: item.location.distance_miles ?? 0,
                    },
                },
            },
        });
    }

    console.log(`Seed complete! Added ${mockData.length} meals.`);
}

main()
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });