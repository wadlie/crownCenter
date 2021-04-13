var FormBiomass = require('../models').FormBiomass;
var models = require('../models')


function getFormBiomasses(req, res) {
    FormBiomass.findAll()
    .then(formsbiomass => {
        res.send(formsbiomass)
    })
}

function getFormBiomass(req, res) {
    FormBiomass.findById(req.params.id)
    .then(formbiomass => {
        res.send(formbiomass)
    })
}

function getFormBiomassByFarmCode(req, res) {
    FormBiomass.findAll({
        include:[{
            model: models.FormSubmission,
            where:{farmcode: req.params.farmcode}
        }]
    }).then(formbiomass => res.send(formbiomass))
}

function getFormBiomassByBarCode(req, res){
    FormBiomass.findOne({where: {barcode: req.params.barcode}})
    .then(formBiomass => {
        if(formBiomass){
            res.send(formBiomass)
        }else{
            res.status(400).send({message: "no formBiomass found"})
        }
    })
}

function addFormBiomass(req, res) {
    FormBiomass.create(req.body)
    .then(formbiomass => res.send(formbiomass))
    .catch(models.Sequelize.ValidationError, function (err) {
        res.status(400).send(err)
    });
}


module.exports = {
    getFormBiomasses,
    getFormBiomass,
    addFormBiomass,
    getFormBiomassByFarmCode,
    getFormBiomassByBarCode,
}
