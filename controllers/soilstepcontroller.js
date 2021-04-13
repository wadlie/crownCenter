var SoilStep = require('../models').SoilStep;
var models = require('../models')

function getSoilSteps(req, res) {
    SoilStep.findAll()
    .then(soilsteps => {
        res.send(soilsteps)
    })
}

function getSoilStep(req, res) {
    SoilStep.findById(req.params.id)
    .then(soilstep => {
        res.send(soilstep)
    })
}

function addSoilStep(req, res) {
    SoilStep.create(req.body)
    .then(soilstep => res.send(soilstep))
    .catch(models.Sequelize.ValidationError, function (err) {
        res.status(400).send(err)
    });
}

function updateSoilStep(req, res) {
    SoilStep.update(req.body, {
        where: {soil_subsample: req.params.barcode}
    })
    .then(updatedSoilStep => {
        if (updatedSoilStep[0]) {
          res.send({ message: "successfully updated soilstep" });
        } else {
          res.status(400).send({ message: "no forms were updated" });
        }
      })
}


module.exports = {
    getSoilSteps,
    getSoilStep,
    addSoilStep,
    updateSoilStep
}