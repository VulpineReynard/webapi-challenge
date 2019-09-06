const express = require('express');
const router = express.Router();

const actionsHelper = require('../data/helpers/actionModel');

// BASE ACTIONS ENDPOINT //
router.route("/")
// get all actions
.get(function rootGetController(req, res){
  actionsHelper.get()
    .then(actions => {
      res.status(200).json(actions)
    })
    .catch(err => {
      res.status(400).send({ message: "Something went wrong." })
    })
})

// ACTION BY ID ENDPOINT //
router.route("/:id")
.get(validateActionId, function idGetController(req, res){

  actionsHelper.get(req.params.id)
    .then(action => {
      res.status(200).send(action);
    })
    .catch(err => {
      res.status(400).send({ message: "Something went wrong." })
    })

})
// delete specific action
.delete(validateActionId, function idDeleteController(req, res){

  actionsHelper.remove(req.params.id)
    .then(data => {
      res.status(200).send('Resourse deleted successfully.');
    })
    .catch(err => {
      res.status(400).send({ message: "Something went wrong." })
    })

})
// update specific action
.put(validateActionId, validateAction, function idPutController(req, res) {

  actionsHelper.update(req.params.id, req.body)
    .then(count => {
      res.status(200).send('Updated Sucessfully.');
    })
    .catch(err => {
      res.status(400).send({ message: "Something went wrong." })
    })

})




// CUSTOM MIDDLEWARE //
function validateActionId(req, res, next) {
  let id = req.params.id;
  actionsHelper.get(id)  
    .then(action => {
      req.user = action.id;
    })
    .catch(err => {
      res.status(400).send("Invalid Action Id")
    })
    next();
}

function validateAction(req, res, next) {
  const { description, notes } = req.body;
  if (isEmpty(req.body)) {
    res.status(400).send({ message: "Missing action data" })
  } else if (req.body && !description) {
    res.status(400).send({ message: "Missing required description field" })
  } else if (req.body && !notes) {
    res.status(400).send({ message: "Missing required notes field" })
  } else {
    next();
  }
};

function isEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

module.exports = router;