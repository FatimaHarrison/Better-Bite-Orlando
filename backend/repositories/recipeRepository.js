import prisma from "../lib/prisma.js";

export const recipeDAO = {
	getAllRecipes: async () => {
		return prisma.recipe.findMany({
			include: { user: true },
		});
	},

	getRecipeById: async (id) => {
		return prisma.recipe.findUnique({
			where: { id: Number(id) },
			include: { user: true },
		});
	},

	getRecipesByUser: async (userId) => {
		return prisma.recipe.findMany({
			where: { userId: Number(userId) },
		});
	},

	createRecipe: async (data) => {
		return prisma.recipe.create({ data });
	},

	updateRecipe: async (id, data) => {
		return prisma.recipe.update({
			where: { id: Number(id) },
			data,
		});
	},

	deleteRecipe: async (id) => {
		return prisma.recipe.delete({
			where: { id: Number(id) },
		});
	},
};
