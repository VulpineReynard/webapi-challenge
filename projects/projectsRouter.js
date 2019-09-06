const express = require('express');
const router = express.Router();
const projectsHelper = require('../data/helpers/projectModel');

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

function validateProjectId(req, res, next) {
  let {id} = req.params;
  projectsHelper.get(id)  
    .then(user => {
      req.user = user;
    })
    .catch(err => {
      res.status(400).send("Invalid User Id")
    })
    next();
}

module.exports = router;