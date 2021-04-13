var FileLogs = require('../models').FileLog;
var models = require('../models')

function getFileLogs(req, res) {
    FileLogs.findAll()
    .then(filelogs => {
        res.send(filelogs)
    })
}


module.exports = {
    getFileLogs,
}