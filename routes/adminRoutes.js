const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  login,
  getAllUsers,
  modifyDetails,
  deleteAccount,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", registerAdmin);
router.post("/login", login);
router.get("/getAllUser", authMiddleware, getAllUsers);
router.put("/modifydetails", authMiddleware, modifyDetails);
router.delete("/deleteaccount", authMiddleware, deleteAccount);

module.exports = router;
