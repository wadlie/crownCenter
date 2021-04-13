var FormYield = require('../models').FormYield;
var models = require('../models')

function getFormYields(req, res) {
    FormYield.findAll()
    .then(formyields => {
        res.send(formyields)
    })
}

function getFormYield(req, res) {
    FormYield.findById(req.params.id)
    .then(formyield => {
        res.send(formyield)
    })
}

function getFormYieldByFarmCode(req, res) {
    FormYield.findAll({
        include:[{
            model: models.FormSubmission,
            where:{farmcode: req.params.farmcode}
        }]
    }).then(formyield => res.send(formyield))
}

function getFormYieldByBarCode(req, res){
    FormYield.findOne({where: {barcode: req.params.barcode}})
    .then(formYield => {
        if(formYield){
            res.send(formYield)
        }else{
            res.status(400).send({message: "no formYield found"})
        }
    })
}

function addFormYield(req, res) {
    FormYield.create(req.body)
    .then(formyield => res.send(formyield))
    .catch(models.Sequelize.ValidationError, function (err) {
        res.status(400).send(err)
    });
}


module.exports = {
    getFormYields,
    getFormYield,
    addFormYield,
    getFormYieldByFarmCode,
    getFormYieldByBarCode
}