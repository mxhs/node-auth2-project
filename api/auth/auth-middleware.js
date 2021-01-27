const Auth = require("./auth-model");
const jwt = require("jsonwebtoken");

module.exports = { validateRegister, authenticateUser };

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

async function authenticateUser(req, res, next) {
	try {
		const token = req.headers.authorization;
		if (token) {
			// ! decoded is the decoded jwt PAYLOAD
			jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
				if (err) {
					res
						.status(401)
						.json(
							"insert lord of the rings gandalf quote *staff slams to ground*"
						);
				} else {
					// ! decoded is the payload of the logged in user
					const { department } = await Auth.findBy({
						username: decoded.username,
					});
					req.body.department = department;
					next();
				}
			});
		}
	} catch (err) {
		next(err);
	}
}
