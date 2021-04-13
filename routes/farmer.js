var models  = require('../models');
var express = require('express');
var router  = express.Router();

const authMiddleware = require('../middlewares/auth');
var farmerController = require("../controllers/farmerController")

router.get('/', authMiddleware.checkAuth, farmerController.getFarmers)
router.get('/id/:id', authMiddleware.checkAuth, farmerController.getFarmer)
router.post('/create', authMiddleware.checkAuth, farmerController.addFarmer)
router.post('/:username/to/:farmcode', authMiddleware.checkAuth, farmerController.addFarmerToFarm)

router.get('/:farmer_id/destroy', function(req, res) {
  models.Farmer.destroy({
    where: {
      id: req.params.farmer_id
    }
  }).then(function() {
    res.redirect('/');
  });
});

router.post('/:farmer_id/tasks/create', function (req, res) {
  console.log(req.params.farmer_id)
  models.Farm.create({
    farmcode: req.body.farmcode,
    farmer_id: req.params.farmer_id
  }).then(function() {
    res.redirect('/');
  }).catch(models.Sequelize.ValidationError, function (err) {
    res.send("validation error")
  });
});

router.get('/:farmer_id/tasks/:task_id/destroy', function (req, res) {
  models.Farm.destroy({
    where: {
      id: req.params.task_id
    }
  }).then(function() {
    res.redirect('/');
  });
});


module.exports = router;
