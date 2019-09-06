const express = require('express');
const router = express.Router();
const projectsHelper = require('../data/helpers/projectModel');
const actionsHelper = require('../data/helpers/actionModel');

// BASE PROJECTS ENDPOINT //
router.route("/")
.get(function rootGetController(req, res){
  projectsHelper.get()
    .then(projects => {
      res.status(200).json(projects)
    })
    .catch(err => {
      res.status(400).send({ message: "Something went wrong." })
    })
})
.post(function rootPostController(req, res){
  projectsHelper.insert(req.body)
    .then(data => {
      res.status(201).send(data)
    })
    .catch(err => {
      res.status(400).send({ message: "Something went wrong." })
    })
})

// PROJECT BY ID ENDPOINT //
router.route("/:id")
// get specific project
.get(validateProjectId, function idGetController(req, res){

  projectsHelper.get(req.params.id)
    .then(project => {
      res.status(200).send(project);
    })
    .catch(err => {
      res.status(400).send({ message: "Something went wrong." })
    })

})
// delete specific project
.delete(validateProjectId, function idDeleteController(req, res){

  projectsHelper.remove(req.params.id)
    .then(data => {
      res.status(200).send('Resourse deleted successfully.');
    })
    .catch(err => {
      res.status(400).send({ message: "Something went wrong." })
    })

})
// update specific project
.put(validateProjectId, function idPutController(req, res) {

  projectsHelper.update(req.params.id, req.body)
    .then(count => {
      res.status(200).send('Updated Sucessfully.');
    })
    .catch(err => {
      res.status(400).send({ message: "Something went wrong." })
    })

})

// ACTIONS OF PROJECT BY ID ENDPOINT //
router.route("/:id/actions")
.get(validateProjectId, function projectWithIdGetController(req, res){
  
  projectsHelper.getProjectActions(req.params.id)
    .then(actions => {
      res.status(200).json(actions)
    })
    .catch(err => {
      res.status(400).send({ message: "Something went wrong." })
    })
})
// create an action
.post(
  validateProjectId, 
  validateAction, 
  function projectWithIdPostController(req, res) {

    console.log(req.body)
  req.body.project_id = req.params.id;
  console.log(req.body)
  actionsHelper.insert(req.body)
    .then(returned => {
      res.status(201).send(returned);
    })
    .catch(err => {
      res.status(400).send({ message: "Something went wrong." })
    })

})



// CUSTOM MIDDLEWARE //
function validateProjectId(req, res, next) {
  let id = req.params.id;
  projectsHelper.get(id)  
    .then(project => {
      req.user = project.id;
    })
    .catch(err => {
      res.status(400).send("Invalid User Id")
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