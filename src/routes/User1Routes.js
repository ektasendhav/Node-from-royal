const routes = require("express").Router()

const user1Controller = require("../controllers/User1Controller")
routes.get("/users",user1Controller.getAllUsers)
// routes.post("/user",userController.addUser)
routes.delete("/users/:id",user1Controller.deleteUser)
routes.get("/users/:id",user1Controller.getUserById)

routes.post("/users/login",user1Controller.login)
routes.post("/users/signup",user1Controller.signup)


module.exports=routes