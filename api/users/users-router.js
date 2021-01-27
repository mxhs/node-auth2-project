const router = require("express").Router();

const Users = require("./users-model.js");
const { authenticateUser } = require("../auth/auth-middleware");

router.get("/", authenticateUser, async (req, res) => {
	try {
		const { department } = req.body;
		const membersByDept = await Users.findBy({ department });
		res.status(200).json(membersByDept);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
