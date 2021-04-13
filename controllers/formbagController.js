var FormBag = require('../models').FormBag;
var models = require('../models');

function getFormBages(req, res) {
    FormBag.findAll()
    .then(formsBag => {
        res.send(formsBag)
    })
}

function getFormBag(req, res) {
    FormBag.findById(req.params.id)
    .then(formBag => {
        res.send(formBag)
    })
}

function getFormBagsByFarmCode(req, res) {
    FormBag.findAll({
        include:[{
            model: models.FormSubmission,
            where:{farmcode: req.params.farmcode}
        }]
    }).then(formbags => res.send(formbags))
}

function getFormBagByBarCode(req, res){
    FormBag.findOne({where: {barcode: req.params.barcode}})
    .then(formbag => {
        if(formbag){
            res.send(formbag)
        }else{
            res.status(400).send({message: "no formbag found"})
        }
    })
}

function addFormBag(req, res) {
    FormBag.create(req.body)
    .then(formBag => res.send(formBag))
    .catch(models.Sequelize.ValidationError, function (err) {
        res.status(400).send(err)
    });
}

function updateFormBag(req, res) {
    FormBag.update(req.body, {where: {barcode: req.body.barcode}})
    .then(formBag => {
        res.send(formBag)
    })
}



module.exports = {
    getFormBages,
    getFormBag,
    addFormBag,
    getFormBagsByFarmCode,
    getFormBagByBarCode,
    updateFormBag
}