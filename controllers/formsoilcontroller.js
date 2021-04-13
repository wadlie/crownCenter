var FormSoil = require('../models').FormSoil;
var models = require('../models')

function getFormSoils(req, res) {
    FormSoil.findAll()
    .then(formSoils => {
        res.send(formSoils)
    })
}

function getFormSoil(req, res) {
    FormSoil.findById(req.params.id)
    .then(formSoil => {
        res.send(formSoil)
    })
}

function addFormSoil(req, res) {
    FormSoil.create(req.body)
    .then(formSoil => res.send(formSoil))
    .catch(models.Sequelize.ValidationError, function (err) {
        res.status(400).send(err)
    });
}

function getFormSoilByBarCode(req, res){
    FormSoil.findOne({where: {barcode: req.params.barcode}})
    .then(formSoil => {
        if(formSoil){
            res.send(formSoil)
        }else{
            res.status(400).send({message: "no formSoil found"})
        }
    })
}

function updateFormSoil(req, res) {
    FormSoil.update(req.body, {where: {barcode: req.params.barcode}})
    .then(formSoil => {
        res.send(formSoil)
    })
}

module.exports = {
    getFormSoils,
    getFormSoil,
    addFormSoil,
    updateFormSoil,
    getFormSoilByBarCode
}