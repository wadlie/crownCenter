var Farmers = require('../models').Farmer;
var models = require('../models')

function getFarmers(req, res) {
    Farmers.findAll({include: [models.Farm]})
    .then(farmers => {
        res.send(farmers)
    })
}

function getFarmer(req, res) {
    Farmers.findById(req.params.id)
    .then(farmer => {
        res.send(farmer)
    })
}

function addFarmer(req, res) {
    Farmers.findOne({where: {username: req.body.username}})
    .then(farmer => {
        if(!farmer){
            Farmers.create({
                lastname: req.body.lastname,
                email: req.body.email,
                username: req.body.username,
                phone: req.body.phone,
                Farms: []
            })
            .then(farmer => res.send(farmer))
        }else{
            models.ErrorLog.create({
                farmcode: req.params.farmcode,
                type: 'validation',
                message: {message: "username already in use."}
            })
            res.status(400).send({message: "username already in use."})
        }
    })  
}

function addFarmerToFarm(req, res) {
    let farmcode = req.params.farmcode
    let username = req.params.username
    let farmerPromise = Farmers.findOne({where: {username:username}})
    models.Farm.findOne({where: {farmcode: farmcode}})
    .then(farm => {
        if(!farm){
            res.status(400).send({message: "farm does not exist"})
        }else{
            farmerPromise.then(farmer => {
                if(!farmer){
                    res.status(400).send({message: "farmer does not exist"})
                }else{
                    farm.addFarmer(farmer, req.body)
                    .then(result => res.send(result))
                    .catch(err => {
                        models.ErrorLog.create({
                            farmcode: req.params.farmcode,
                            type: 'other',
                            message: JSON.stringify(err)
                        })
                    })
                    .catch(models.sequelize.ValidationError,err => {
                        models.ErrorLog.create({
                            farmcode: req.params.farmcode,
                            type: 'validation',
                            message: JSON.stringify(err)
                        })
                    })
                }
            })
        }
    })
    
}

// models.ErrorLog.create({
//     farmcode: req.params.farmcode,
//     type: 'validation',
//     message: JSON.stringify(err)
// })
// })
// .catch(err => {
// models.ErrorLog.create({
//     farmcode: req.params.farmcode,
//     type: 'other',
//     message: JSON.stringify(err)
// })
// })


module.exports = {
    getFarmers,
    getFarmer,
    addFarmer,
    addFarmerToFarm
}