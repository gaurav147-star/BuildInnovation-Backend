const express = require("express");
const router = express.Router();
const {
  register,
  login,
  modifyDetails,
  deleteAccount,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", register);
router.post("/login", login);
router.put("/modifydetails", authMiddleware, modifyDetails);
router.delete("/deleteaccount", authMiddleware, deleteAccount);

module.exports = router;
