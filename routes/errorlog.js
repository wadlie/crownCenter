var errorlogController = require("../controllers/errorlogController")
var express = require('express');
var router  = express.Router();

const authMiddleware = require('../middlewares/auth');

/* /errorlog/ */
router.get("/", authMiddleware.checkAuth, errorlogController.getErrorLogs)
router.get("/filter", authMiddleware.checkAuth, errorlogController.getErrorLogsWithFilter);

module.exports = router