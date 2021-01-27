const bcryptjs = require("bcryptjs");
const router = require("express").Router();
const Users = require("./auth-model");
const jwt = require("jsonwebtoken");
const { validateRegister } = require("./auth-middleware");

router.post("/register", validateRegister, async (req, res, next) => {
	try {
		const credentials = req.body;
		//Process to hash a password
		const rounds = process.env.BCRYPT_ROUNDS || 8;
		const hash = bcryptjs.hashSync(credentials.password, rounds);

		credentials.password = hash;

		//Saving User to the database
		const newUser = await Users.add(credentials);
		res.status(201).json({ data: newUser });
	} catch (err) {
		next(err);
	}
});

router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await Users.findBy({ username });
		// compare the password with the hash stored in database
		if (bcryptjs.compareSync(password, user.password)) {
			//build the token and send it back
			const token = generateToken(user);
			res.status(200).json({ message: "Welcome", token });
		} else {
			res.status(401).json({ message: "invalid login info" });
		}
	} catch (err) {
		next(err);
	}
});

function generateToken(user) {
	const payload = {
		subject: user.id,
		username: user.username,
	};
	const options = {
		expiresIn: "1h",
	};
	// ? What purpose does separating the secrets serve in a separate folder vs done like this?
	const secret = process.env.JWT_SECRET;

	return jwt.sign(payload, secret, options);
}

module.exports = router;
