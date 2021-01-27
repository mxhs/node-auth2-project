const Auth = require("./auth-model");

module.exports = { validateRegister };

async function validateRegister(req, res, next) {
	// checking that all the correct keys of credentials are there
	// if there isn't currently a user of the same username
	// checking to make sure there isn't any additional keys

	if (checkKeys(req.body)) {
		res.status(401).json({ errorMessage: "invalid keys on request object" });
	}

	if (
		!(typeof req.body.username === "string") ||
		!(typeof req.body.password === "string")
	) {
		res.status(401).json({
			errorMessage:
				'username and password must be of type "string" and cannot be undefined',
		});
	}

	const user = await Auth.findBy({ username: req.body.username });
	if (user) {
		res.status(401).json({ errorMessage: "This username already exists" });
	}

	next();
}

function checkKeys(obj) {
	let invalidKey = false;
	// ! vvv this returns all the keys in an object as an array
	Object.keys(obj).forEach((key) => {
		//if the key is not included in this array of strings
		if (!["username", "password", "department"].includes(key)) {
			invalidKey = true;
		}
	});
	return invalidKey;
}
