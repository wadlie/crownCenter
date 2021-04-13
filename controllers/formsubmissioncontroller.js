var FormSubmission = require("../models").FormSubmission;
var models = require("../models");

function handleEmitFormSubmission(req) {
  let io = req.app.get('socketio');
  FormSubmission.findAll({
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


function getFormSubmissions(req, res) {
  FormSubmission.findAll({
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
    res.send(formsubmissions);
  });
}

function getFormSubmission(req, res) {
  FormSubmission.findById(req.params.id, {
    include: [
      models.FormBag,
      models.FormBiomass,
      models.FormBulkDensity,
      { model: models.FormFieldHistory, include: [models.CoverCrop] },
      models.FormType,
      models.FormYield,
      models.FormSoil
    ]
  }).then(formsubmission => {
    res.send(formsubmission);
  });
}

function getFormSubmissionByFarmCode(req, res) {
  FormSubmission.findAll({
    where: { farmcode: req.params.farmcode },
    include: [
      models.FormBag,
      models.FormBiomass,
      models.FormBulkDensity,
      { model: models.FormFieldHistory, include: [models.CoverCrop] },
      models.FormType,
      models.FormYield,
      models.FormSoil
    ]
  }).then(formsubmission => res.send(formsubmission));
}

function addFormSubmission(req, res) {
  FormSubmission.create(req.body, {
    include: [
      models.FormBag,
      models.FormBiomass,
      models.FormBulkDensity,
      { model: models.FormFieldHistory, include: [models.CoverCrop] },
      models.FormSoil,
      models.FormYield
    ]
  })
    .then(formsubmission => {
      handleEmitFormSubmission(req)
      res.send(formsubmission)
    })
    .catch(models.Sequelize.ValidationError, function(err) {
      res.status(400).send(err);
    });
}

function updateFormSubmissionWithBarCode(req, res) {
  let formType = req.params.formType;

  if (formType == "FormBag") {
    handleUpdateFormBag(req, res);
  } else if (formType == "FormBiomass") {
    handleUpdateFormBiomass(req, res);
  } else if (formType == "FormBulkDensity") {
    handleUpdateFormBulkDensity(req, res);
  } else if (formType == "FormFieldHistory") {
    handleUpdateFormFieldHistory(req, res);
  } else if (formType == "FormSoil") {
    handleUpdateFormSoil(req, res);
  } else if (formType == "FormYield") {
    handleUpdateFormYield(req, res);
  } else {
    res.send({ message: "invalid formType " + formType });
  }
}

function handleUpdateFormBag(req, res) {
  models.FormBag.update(req.body, {
    where: { barcode: req.params.barcode }
  }).then(updatedFormBag => {
    if (updatedFormBag[0]) {
      handleEmitFormSubmission(req)
      res.send({ message: "successfully updated a form bag" });
    } else {
      res.status(400).send({ message: "no forms were updated" });
    }
  });
}

function handleUpdateFormBulkDensity(req, res) {
  models.FormBulkDensity.update(req.body, {
    where: { barcode: req.params.barcode }
  })
    .then(updatedFormBulkDensity => {
      if (updatedFormBulkDensity[0]) {
        handleEmitFormSubmission(req)
        res.send({ message: "successfully updated a form bulkdensity" });
      } else {
        res.status(400).send({ message: "no forms were updated" });
      }
    })
    .catch(err => res.status(400).send(err));
}

function handleUpdateFormBiomass(req, res) {
  models.FormBiomass.update(req.body, {
    where: { barcode: req.params.barcode }
  })
    .then(updatedFormBiomass => {
      if (updatedFormBiomass[0]) {
        handleEmitFormSubmission(req)
        res.send({ message: "successfully updated a form biomass" });
      } else {
        res.status(400).send({ message: "no forms were updated" });
      }
    })
    .catch(err => res.status(400).send(err));
}

function handleUpdateFormFieldHistory(req, res) {
  let formFieldHistoryUpdatePromise = models.FormFieldHistory.findOne({
    where: { farmcode: req.params.barcode },
    include: [models.CoverCrop]
  }).then(formfieldhistory => {
    formfieldhistory.update(req.body);
    if (req.body.CoverCrops) {
      // covercrops that needs to be removed than updated
      let changeCCNumbs = req.body.CoverCrops.map(cc => cc.cover_crop_number);
      formfieldhistory.getCoverCrops().then(covercrops => {
        // get the cover crop ids for the to be removed and updated cover crops
        let coverCropIds = covercrops
          .filter(cc => {
            return changeCCNumbs.includes(cc.cover_crop_number);
          })
          .map(cc => cc.id);

        // Deletes all covercrop found in the body by its id
        if (coverCropIds.length != 0) {
          models.CoverCrop.destroy({
            where: {
              id: { $or: coverCropIds }
            }
          }).then(status => {
            // Bulk create new covercrops using the cover crops found in req.body
            models.CoverCrop.bulkCreate(
              req.body.CoverCrops.map(cc => ({
                ...cc,
                formfieldhistory_id: formfieldhistory.id
              }))
            );
          });
        } else {
          models.CoverCrop.bulkCreate(
            req.body.CoverCrops.map(cc => ({
              ...cc,
              formfieldhistory_id: formfieldhistory.id
            }))
          );
        }
      });
    }
  });
  formFieldHistoryUpdatePromise
    .then(success => {
      handleEmitFormSubmission(req)
      res.send({ message: "form updated", data: success })
    })
    .catch(err => res.status(400).send(err));
}

function handleUpdateFormSoil(req, res) {
  models.FormSoil.update(req.body, {
    where: { barcode: req.params.barcode }
  })
    .then(updatedFormSoil => {
      if (updatedFormSoil[0]) {
        handleEmitFormSubmission(req)  
        res.send({ message: "successfully updated a form soil" });
      } else {
        res.status(400).send({ message: "no forms were updated" });
      }
    })
    .catch(err => res.status(400).send(err));
}

function handleUpdateFormYield(req, res) {
  models.FormYield.update(req.body, {
    where: { barcode: req.params.barcode }
  })
    .then(updatedFormYield => {
      if (updatedFormYield[0]) {
        handleEmitFormSubmission(req)
        res.send({ message: "successfully updated a form yield" });
      } else {
        res.status(400).send({ message: "no forms were updated" });
      }
    })
    .catch(err => res.status(400).send(err));
}

module.exports = {
  getFormSubmissions,
  getFormSubmission,
  addFormSubmission,
  getFormSubmissionByFarmCode,
  updateFormSubmissionWithBarCode
};
