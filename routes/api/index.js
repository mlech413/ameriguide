const router = require("express").Router();
const basicRoutes = require("./basics");

// Basic routes
router.use("/basics", basicRoutes);

module.exports = router;
