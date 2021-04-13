var FormFieldHistory = require('../models').FormFieldHistory;
var models = require('../models')

function getFormFieldHistories(req, res) {
    FormFieldHistory.findAll({include: [models.CoverCrop]})
    .then(formsfieldhistory => {
        res.send(formsfieldhistory)
    })
}

function getFormFieldHistory(req, res) {
    FormFieldHistory.findById(req.params.id, {include: [models.CoverCrop]})
    .then(formfieldhistory => {
        res.send(formfieldhistory)
    })
}

function getFormFieldByFarmCode(req, res) {
    FormFieldHistory.findOne({
        include:[{
            model: models.FormSubmission,
            where:{farmcode: req.params.farmcode}
        }]
    }).then(formfieldhistory => {
        if(formfieldhistory) {
            res.send(formfieldhistory)
        }else{
            res.status(400).send({message: "no formFieldHistory found"})
        }
    })
}

function getFormFieldHistoryByBarCode(req, res){
    FormFieldHistory.findOne({where: {farmcode: req.params.barcode}})
    .then(formFieldHistory => {
        if(formFieldHistory){
            res.send(formFieldHistory)
        }else{
            res.status(400).send({message: "no formFieldHistory found"})
        }
    })
}

function addFormFieldHistory(req, res) {
    FormFieldHistory.create(req.body)
    .then(formfieldhistory => res.send(formfieldhistory))
    .catch(models.Sequelize.ValidationError, function (err) {
        res.status(400).send(err)
    });
}


module.exports = {
    getFormFieldHistories,
    getFormFieldHistory,
    getFormFieldByFarmCode,
    addFormFieldHistory,
    getFormFieldHistoryByBarCode
}