const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const router = express.Router();
const { getAllUsers } = require("../controllers/userController");

//Only admin can get the list of all the users(client, lawyer,admin)
router.get("/", verifyToken, authorizeRoles("admin"), getAllUsers);

//Only admins can access this router
router.get("/admin", verifyToken, authorizeRoles("admin"),(req,res) => {
    res.json({ message: "Welcome Admin"});
});

//Both admin and lawyer can access this router
router.get("/lawyer",verifyToken, authorizeRoles("admin", "lawyer"), (req,res) => {
    res.json({ message: "Welcome Lawyer"});
});


//All can access this router
router.get("/client",verifyToken,authorizeRoles("admin", "client"), (req,res) => {
    res.json({ message: "Welcome Client"});
});

module.exports = router;