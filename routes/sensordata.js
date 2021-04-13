var sensorDataController = require("../controllers/sensordatacontroller")
var express = require('express');
var router  = express.Router();

const authMiddleware = require('../middlewares/auth');

/* /coverCrop/ */
router.get("/", authMiddleware.checkAuth, sensorDataController.getSensorDatas)
router.get("/id/:id", authMiddleware.checkAuth, sensorDataController.getSensorData)
router.get("/treatmentcounts", authMiddleware.checkAuth, sensorDataController.getTreatmentCounts)
router.get("/rhcounts", authMiddleware.checkAuth, sensorDataController.getRHCounts)
router.get("/latesttreatmenttimestamp", authMiddleware.checkAuth, sensorDataController.getLatestTreatmentTimestamp)
router.get("/latestrhtimestamp", authMiddleware.checkAuth, sensorDataController.getLatestRHTimestamp)
router.get("/:backtime", authMiddleware.checkAuth, sensorDataController.getSensorDatasByDate)
router.post("/create", authMiddleware.checkAuth, sensorDataController.addSensorData)



module.exports = router