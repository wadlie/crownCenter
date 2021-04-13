var Sensor = require('../models').Sensor;
var models = require('../models')

function getSensors(req, res) {
    Sensor.findAll({
        include: [models.SensorData]
    })
    .then(sensors => {
        res.send(sensors)
    })
}

function getSensor(req, res) {
    Sensor.findById(req.params.id, {include:[models.SensorData]})
    .then(sensor => {
        res.send(sensor)
    })
}

function getSensorBy(req, res) {
    Sensor.findOne({where: req.body})
    .then(sensor => {
        res.send(sensor)
    })
}

function getSensorsBy(req, res) {
    Sensor.findAll({where: req.body})
    .then(sensors => {
        res.send(sensors)
    })
}

function addSensor(req, res) {
    Sensor.create(req.body, {
        include: [models.SensorData]
    })
    .then(sensor => res.send(sensor))
    .catch(models.Sequelize.ValidationError, function (err) {
        res.status(400).send(err)
    });
}

function addSensorDataBySensorId(req, res) {
    models.SensorData.create(req.body, {
        include: [{model: Sensor, where: {id: req.params.id}}],
    })
    .then(s => res.send(s))
    // models.Sensor.findById(req.params.id)
    // .then(sensor => {
    //     if(sensor){
    //         console.log('id', req.params.id)
    //         models.SensorData.create(req.body,{
    //             include: [{model: models.Sensor, where: {id: req.params.id}}]
    //         })
    //         .then(sensordata => res.send(sensordata))
    //         .catch(models.Sequelize.ValidationError, function (err) {
    //             res.status(400).send(err)
    //         });
    //     }else{
    //         models.SensorData.create(req.body)
    //         .then(sensordata => res.send(sensordata))
    //         .catch(models.Sequelize.ValidationError, function (err) {
    //             res.status(400).send(err)
    //         });
    //     }
    // })
}


module.exports = {
    getSensors,
    getSensor,
    getSensorBy,
    getSensorsBy,
    addSensor,
    addSensorDataBySensorId
}