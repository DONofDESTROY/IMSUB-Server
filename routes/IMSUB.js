const express = require("express");
const { loginIMSUB, registerIMSUB } = require("../controller/IMSUB-controller");
const router = express.Router();

router.route("/login/:id").post(loginIMSUB);
router.route("/register/:id").post(registerIMSUB);

module.exports = router;
