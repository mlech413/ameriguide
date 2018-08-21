const router = require("express").Router();
const basicsController = require("../../controllers/basicsController");

// Matches with "/api/basics"
router.route("/")
  .get(basicsController.findAll)
  .post(basicsController.create);

// Matches with "/api/basics/:id"
router
  .route("/:id")
  .get(basicsController.findById)
  .put(basicsController.update)
  .delete(basicsController.remove);

module.exports = router;
