var SensorData = require('../models').SensorData;
var models = require('../models')

function getSensorDatas(req, res) {
    SensorData.findAll()
    .then(sensordata => {
        res.send(sensordata)
    })
}

function getSensorDatasByDate(req, res) {
    let today = new Date();
    let is_sorted = req.query['sorted']

    if(req.params.backtime == 'day'){
        today.setDate(today.getDate - 1);
    }else if(req.params.backtime == 'month'){
        today.setMonth(today.getMonth() - 1);
    }else if(req.params.backtime == 'year'){
        today.setFullYear(today.getFullYear() - 1);
    }else{
        // default to today
    }
    if(is_sorted){
        SensorData.findAll({
            where: {timestamp: {
                $gte: today.toDateString(),
            }},
            order: [['timestamp', 'DESC']]
        })
        .then(sensordata => {
            res.send(sensordata)
        })
    }else{
        SensorData.findAll({
            where: {timestamp: {
                $gte: today.toDateString()
            }},
        })
        .then(sensordata => {
            res.send(sensordata)
        })
    }
}


function getSensorData(req, res) {
    SensorData.findById(req.params.id)
    .then(sensordatum => {
        res.send(sensordatum)
    })
}

function addSensorData(req, res) {
    SensorData.create(req.body)
    .then(sd => res.send(sd))
}

function getTreatmentCounts(req, res) {
    SensorData.count({group: ["code", "trt"], attributes: ["code", "trt"]})
    .then(sd => res.send(sd))
}

function getRHCounts(req, res) {
    SensorData.count({
        group: ["code"], 
        attributes: ["code"], 
        where: {rh: {$ne: null}}
    })
    .then(sd => res.send(sd))
}

function getLatestTreatmentTimestamp(req, res) {
    SensorData.findAll({raw: true, group: ["code", "trt"], attributes: ["code", "trt", models.Sequelize.fn('max', models.Sequelize.col("timestamp"))]})
    .then(sd => res.send(sd))
}

function getLatestRHTimestamp(req, res) {
    SensorData.findAll({where: {rh: {$ne: null}}, raw: true, group: ["code"], attributes: ["code", models.Sequelize.fn('max', models.Sequelize.col("timestamp"))]})
    .then(sd => res.send(sd))
}

module.exports = {
    getSensorDatas,
    getSensorData,
    getSensorDatasByDate,
    addSensorData,
    getTreatmentCounts,
    getRHCounts,
    getLatestTreatmentTimestamp,
    getLatestRHTimestamp,
}