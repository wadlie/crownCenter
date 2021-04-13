var formTypeController = require("../controllers/formtypecontroller")
var express = require('express');
var router  = express.Router();

const authMiddleware = require('../middlewares/auth');

router.get("/", authMiddleware.checkAuth, formTypeController.getFormTypes)
router.get("/id/:id", authMiddleware.checkAuth, formTypeController.getFormType)
router.get("/farmcode/:farmcode", authMiddleware.checkAuth, formTypeController.getFormTypeByFarmCode)
router.post("/create", authMiddleware.checkAuth, formTypeController.addFormType)

module.exports = router