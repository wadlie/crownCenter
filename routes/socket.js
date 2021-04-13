module.exports = function(app, io) {
  var socketController = require("../controllers/socketcontroller")(io);
  var express = require("express");
  var router = express.Router();

  const authMiddleware = require("../middlewares/auth");

  /* /coverCrop/ */
  router.get("/", authMiddleware.checkAuth, socketController.getSocket);

  return router;
};
