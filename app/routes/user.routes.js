module.exports = app => {
    const users = require("../controller/user.controller.js");
    const {auth, authAdmin} = require('../middlewares/user.auth');

    var router = require("express").Router();
  
    // Create a new User
    router.post("/users", authAdmin, users.create);
  
    // Retrieve all users
    router.get("/users", auth, users.findAll);
  
    // Retrieve a single User with id
    router.get("/users/:id", auth, users.findOne);
  
    // Update a User with id
    router.put("/users/:id", authAdmin, users.update);
  
    // Delete a User with id
    router.delete("/users/:id", authAdmin, users.delete);
  
    // Create a new User
    router.delete("/users", authAdmin, users.deleteAll);

    //Login
    router.post("/login", users.login);

    //Logout
    router.get("/logout", auth,  users.logout);
  
    app.use('/api', router);
  };