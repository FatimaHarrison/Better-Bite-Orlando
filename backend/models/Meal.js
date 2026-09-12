const Restaurant = require("./Restaurant");
const Nutrition = require("./Nutrition");
const Location = require("./Location");

class Meal {
	constructor({
		id = null,
		name = null,
		restaurant = null,
		price = null,
		nutrition = null,
		dietary = [],
		category = null,
		location = null,
		rating = null,
	} = {}) {
		this.id = id;
		this.name = name;

		this.restaurant = restaurant ? new Restaurant(restaurant) : null;

		this.price = price;

		this.nutrition = nutrition ? new Nutrition(nutrition) : null;

		this.dietary = Array.isArray(dietary) ? dietary : [];

		this.category = category;

		this.location = location ? new Location(location) : null;

		this.rating = rating;
	}
}

module.exports = Meal;
