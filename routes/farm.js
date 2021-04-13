module.exports = function(app, io) {

    var farmController = require("../controllers/farmController")(io)
    var express = require('express');
    var router  = express.Router();

    const authMiddleware = require('../middlewares/auth');

    /* /farm/ */
    router.get("/", authMiddleware.checkAuth, farmController.getFarms)
    router.get("/id/:id", authMiddleware.checkAuth, farmController.getFarm)

    // Need to document
    router.get('/farmcode/:farmcode', authMiddleware.checkAuth, farmController.getFarmByFarmCode)
    router.get('/year/:year', authMiddleware.checkAuth, farmController.getFarmsByYear)


    router.post("/create", authMiddleware.checkAuth, farmController.addFarm)
    router.post('/farmcode/:farmcode/formsubmission', authMiddleware.checkAuth, farmController.addFormSubmissionWithFarmCode)

    router.delete('/farmcode/:farmcode', authMiddleware.checkAuth, farmController.deleteFarmByFarmCode)
    router.delete('/id/:id', authMiddleware.checkAuth, farmController.deleteFarmByID)


    return router
}