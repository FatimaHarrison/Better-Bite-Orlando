const Restaurant = require("./Restaurant");
const Nutrition = require("./Nutrition");
const Location = require("./Location");

class Meal {
	constructor({
		id = null,
		name = null,
		price = null,
		category = null,
		dietary = [],
		rating = null,
		restaurant = null,
		nutrition = null,
		location = null,
	} = {}) {
		this.id = id;
		this.name = name;
		this.price = price;
		this.category = category;
		this.dietary = dietary;
		this.rating = rating;

		this.restaurant = restaurant ? new Restaurant(restaurant) : null;

		this.nutrition = nutrition ? new Nutrition(nutrition) : null;

		this.location = location ? new Location(location) : null;
	}
}

module.exports = Meal;
