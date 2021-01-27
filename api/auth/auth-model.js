const db = require("../../database/dbconfig");

module.exports = {
	add,
	findBy,
};

async function add(user) {
	const [id] = await db("users").insert(user);
	//.where({id}) is the same
	return db("users").where("id", id).select("username");
}

function findBy(params) {
	return db("users").where(params).first();
}
