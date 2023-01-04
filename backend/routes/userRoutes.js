const express = require("express");
const {
  registerUser,
  userAuth,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", userAuth);

module.exports = router;
