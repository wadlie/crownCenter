var ErrorLogs = require("../models").ErrorLog;
var models = require("../models");

function getErrorLogs(req, res) {
  ErrorLogs.findAll().then(errorlogs => {
    res.send(errorlogs);
  });
}

function getErrorLogsWithFilter(req, res) {
  if (req.query.count) {
    ErrorLogs.findAll({
      limit: req.query.count.toString(),
      order: [["createdAt", "DESC"]]
    })
      .then(errorLogs => res.send(errorLogs))
      .catch(err => {
        console.log(err)
        res.send({ message: "couldn't get errorlogs" });
    })
  }
}

module.exports = {
  getErrorLogs,
  getErrorLogsWithFilter
};
