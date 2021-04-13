module.exports = function(io) {
  var that = {};
  /*
   * Private local variable
   * made const so that
   * one does not alter it by mistake
   * later on.
   */

  var Farms = require("../models").Farm;
  var models = require("../models");


  function handleEmitFormSubmission(req) {
    let io = req.app.get('socketio');
    models.FormSubmission.findAll({
      include: [
        models.FormBag,
        models.FormBiomass,
        models.FormBulkDensity,
        { model: models.FormFieldHistory, include: [models.CoverCrop] },
        models.FormType,
        models.FormYield,
        models.FormSoil
      ]
    }).then(formsubmissions => {
      io.emit('formsubmission', formsubmissions)
    });
  }

  that.getFarms = function(req, res) {
    Farms.findAll().then(farms => {
      res.send(farms);
    });
  };

  that.getFarm = function(req, res) {
    Farms.findById(req.params.id).then(farm => {
      if (farm) {
        res.send(farm);
      } else {
        res.status(400).send("No farm found");
      }
    });
  };

  that.getFarmByFarmCode = function(req, res) {
    Farms.findOne({ where: { farmcode: req.params.farmcode } }).then(farm => {
      if (farm) {
        res.send(farm);
      } else {
        res.status(400).send("No farm found");
      }
    });
  };

  that.getFarmsByYear = function(req, res) {
    Farms.findAll({ where: { year: req.params.year } }).then(farms => {
      res.send(farms);
    });
  };

  that.addFarm = function(req, res) {
    Farms.findOne({ where: { farmcode: req.body.farmcode } }).then(farm => {
      if (farm) {
        models.ErrorLog.create({
          farmcode: req.body.farmcode,
          type: "duplicate",
          message: "Farmcode already exists"
        });
        res.status(400).send({ message: "Farmcode already exists" });
      } else {
        Farms.create(req.body)
          .then(farm => {
            Farms.findAll({})
            .then(farms=> {
              io.emit("farm", farms)
            })
            Farms.findAll({include: [models.Farmer]})
            .then(farmfarmers => {
              io.emit("farmfarmer", farmfarmers)
            })
            res.send(farm)
          })
          .catch(models.Sequelize.ValidationError, function(err) {
            models.ErrorLog.create({
              farmcode: req.body.farmcode,
              type: "validation",
              message: JSON.stringify(err.message)
            }).then(error => res.status(400).send(error));
          })
          .catch(models.Sequelize.DatabaseError, function(err) {
            models.ErrorLog.create({
              farmcode: req.body.farmcode,
              type: "database",
              message: err.message
            }).then(error =>
              res.status(400).send({ name: err.name, message: err.message })
            );
          })
          .catch(function(err) {
            res.status(400).send(err);
          });
      }
    });
  };

  that.addFormSubmissionWithFarmCode = function(req, res) {
    out = req.body;
    out["farmcode"] = req.params.farmcode;
    models.Farm.findOne({
      where: { farmcode: req.params.farmcode }
    }).then(farm => {
      if (farm) {
        out["farm_id"] = farm.id;
        models.FormSubmission.create(out, {
          include: [
            models.FormBag,
            models.FormBiomass,
            models.FormBulkDensity,
            { model: models.FormFieldHistory, include: [models.CoverCrop] },
            models.FormSoil,
            models.FormYield
          ]
        })
          .then(form => {
            handleEmitFormSubmission(req)
            res.send(form)
          })
          .catch(models.Sequelize.ValidationError, err => {
            models.ErrorLog.create({
              farmcode: req.params.farmcode,
              type: "validation",
              message: JSON.stringify(err.message)
            });
            res.status(400).send(err);
          })
          .catch(err => {
            models.ErrorLog.create({
              farmcode: req.params.farmcode,
              type: "other",
              message: JSON.stringify(err.message)
            });
            res.status(400).send(err);
          });
      } else {
        res.status(400).send({ message: "farm not found" });
      }
    });
  };

  that.deleteFarmByFarmCode = function(req, res) {
    let farmcode = req.params.farmcode;
    Farms.findOne({ where: { farmcode: farmcode } }).then(farm => {
      if (farm) {
        farm
          .destroy()
          .then(destroyed_farm =>
            res.send({ message: "successfully deleted a farm" })
          );
      } else {
        res.status(400).send({ message: "farmcode not found" });
      }
    });
  };

  that.deleteFarmByID = function(req, res) {
    let id = req.params.id;
    Farms.findById(id).then(farm => {
      if (farm) {
        farm
          .destroy()
          .then(destroyed_farm =>
            res.send({ message: "successfully deleted a farm" })
          );
      } else {
        res.status(400).send({ message: "farm id not found" });
      }
    });
  };

  return that;
};
