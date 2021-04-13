var filelogController = require("../controllers/filelogController")
var express = require('express');
var router  = express.Router();

const authMiddleware = require('../middlewares/auth');

/* /filelog/ */
router.get("/", authMiddleware.checkAuth, filelogController.getFileLogs)

module.exports = router