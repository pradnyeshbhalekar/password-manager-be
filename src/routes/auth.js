const express = require("express");
const { googleLogin } = require("../controller/authController");

const router = express.Router();

router.post("/google", googleLogin);

module.exports = router;
