var FormBulkDensity = require('../models').FormBulkDensity;
var models = require('../models')

function getFormBulkDensities(req, res) {
    FormBulkDensity.findAll()
    .then(formsbulkdensity => {
        res.send(formsbulkdensity)
    })
}

function getFormBulkDensity(req, res) {
    FormBulkDensity.findById(req.params.id)
    .then(formbulkdensity => {
        res.send(formbulkdensity)
    })
}

function getFormBulkDensityByFarmCode(req, res) {
    FormBulkDensity.findAll({
        include:[{
            model: models.FormSubmission,
            where:{farmcode: req.params.farmcode}
        }]
    }).then(formbulkdensity => res.send(formbulkdensity))
}

function getFormBulkDensityByBarCode(req, res){
    FormBulkDensity.findOne({where: {barcode: req.params.barcode}})
    .then(formBulkDensity => {
        if(formBulkDensity){
            res.send(formBulkDensity)
        }else{
            res.status(400).send({message: "no formBulkDensity found"})
        }
    })
}

function addFormBulkDensity(req, res) {
    FormBulkDensity.create(req.body)
    .then(formbulkdensity => res.send(formbulkdensity))
    .catch(models.Sequelize.ValidationError, function (err) {
        res.status(400).send(err)
    });
}


module.exports = {
    getFormBulkDensities,
    getFormBulkDensity,
    addFormBulkDensity,
    getFormBulkDensityByFarmCode,
    getFormBulkDensityByBarCode
}