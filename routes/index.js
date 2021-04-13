var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
  models.Farm.findAll({
    include: [models.Farmer]
  }).then(function(farmfarmers) {
    console.log(farmfarmers)
    res.render('index', {
      title: 'Sequelize: Express Example',
      farmfarmers: farmfarmers
    });
  });
});

router.get('/api', function(req, res){
  res.render('api',{})
});


router.get('/forms', function(req, res){
  models.FormSubmission.findAll({
    include: [models.FormBag, models.FormBiomass, models.FormBulkDensity, 
      models.FormFieldHistory, models.FormType, models.FormYield, models.FormSoil]
  }).then(function(formsubmissions) {
    console.log(formsubmissions)
    res.render('formsubmission', {
      title: 'Form Submissions',
      forms: formsubmissions,
      data: JSON.stringify(formsubmissions)
    })
  })
})

module.exports = router;
