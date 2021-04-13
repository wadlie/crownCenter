var FormType = require('../models').FormType;
var models = require('../models')

function getFormTypes(req, res) {
    FormType.findAll()
    .then(formtypes => {
        res.send(formtypes)
    })
}

function getFormType(req, res) {
    FormType.findById(req.params.id)
    .then(formtype => {
        res.send(formtype)
    })
}

function getFormTypeByFarmCode(req, res) {
    FormType.findAll({
        include:[{
            model: models.FormSubmission,
            where:{farmcode: req.params.farmcode}
        }]
    }).then(formtype => res.send(formtype))
}

function addFormType(req, res) {
    FormType.create(req.body)
    .then(formtype => res.send(formtype))
    .catch(models.Sequelize.ValidationError, function (err) {
        res.status(400).send(err)
    });
}


module.exports = {
    getFormTypes,
    getFormType,
    addFormType,
    getFormTypeByFarmCode
}