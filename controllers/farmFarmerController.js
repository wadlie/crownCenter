var FarmFarmers = require('../models').FarmFarmer;
var models = require('../models')

function getFarmFarmers(req, res) {
    models.Farm.findAll({include: [models.Farmer]})
    .then(farms => {
        res.send(farms)
    })
}

function getFarmFarmersAscend(req, res) {
    models.Farm.findAll({
        include: [models.Farmer],
        order: [['farmcode']]
    })
    .then(farms => {
        res.send(farms)
    })
}

function getFarmFarmerById(req, res) {
    models.Farm.findById(req.params.id, {include: [models.Farmer]})
    .then(farmfarmer => {
        res.send(farmfarmer)
    })
}

function getFarmFarmerByFarmcode(req, res){
    models.Farm.findOne({
        where: {farmcode: req.params.farmcode},
        include: [models.Farmer]
    })
    .then(farmfarmer => {
        res.send(farmfarmer)
    })
}

function updateFarmFarmerById(req, res){
    FarmFarmers.findById(req.params.id)
    .then(farmfarmer => {
        if(farmfarmer){
            farmfarmer.update(req.body)
            .then(farmfarmer => res.status(200).send(farmfarmer))
        }else{
            res.staus(400).send({message: "farmerfarmer not found!"})
        }
    })
}


module.exports = {
    getFarmFarmers,
    getFarmFarmersAscend,
    getFarmFarmerById,
    getFarmFarmerByFarmcode,
    updateFarmFarmerById,
}