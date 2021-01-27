const db = require("../../database/dbconfig");

function findBy(params) {
	return db("users").where(params);
}

module.exports = { findBy };
