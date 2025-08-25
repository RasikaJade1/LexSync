const express = require("express");

const router = express.Router();

//Only admins can access this router
router.get("/admin", (req,res) => {
    res.json({ message: "Welcome Admin"});
});

//Both admin and lawyer can access this router
router.get("/lawyer", (req,res) => {
    res.json({ message: "Welcome Lawyer"});
});


//All can access this router
router.get("/client", (req,res) => {
    res.json({ message: "Welcome Client"});
});

module.exports = router;