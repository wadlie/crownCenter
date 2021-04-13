var CoverCrops = require('../models').CoverCrop;
var models = require('../models')

function getCoverCrops(req, res) {
    CoverCrops.findAll()
    .then(coverCrops => {
        res.send(coverCrops)
    })
}

function getCoverCrop(req, res) {
    CoverCrops.findById(req.params.id)
    .then(coverCrop => {
        res.send(coverCrop)
    })
}

function addCoverCrop(req, res) {
    CoverCrops.create(req.body)
    .then(coverCrop => res.send(coverCrop))
    .catch(models.Sequelize.ValidationError, function (err) {
        res.status(400).send(err)
    });
}


module.exports = {
    getCoverCrops,
    getCoverCrop,
    addCoverCrop
}