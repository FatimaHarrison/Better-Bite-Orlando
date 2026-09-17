class Location {
	constructor({
		address = null,
		lat = null,
		lon = null,
		distanceMiles = null,
	} = {}) {
		this.address = address;
		this.lat = lat;
		this.lon = lon;

		// Calculated value, not stored in the database.
		this.distanceMiles = distanceMiles;
	}
}

module.exports = Location;
