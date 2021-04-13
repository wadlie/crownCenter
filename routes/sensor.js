var sensorController = require("../controllers/sensorcontroller")
var express = require('express');
var router  = express.Router();

const authMiddleware = require('../middlewares/auth');

/* /coverCrop/ */
router.get("/", authMiddleware.checkAuth, sensorController.getSensors)
router.get("/id/:id", authMiddleware.checkAuth, sensorController.getSensor)
router.post("/create", authMiddleware.checkAuth, sensorController.addSensor)
router.post("/id/:id/sensordata/create", authMiddleware.checkAuth, sensorController.addSensorDataBySensorId)


module.exports = router