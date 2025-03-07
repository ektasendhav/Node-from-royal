console.log("user file loaded...")
var userName = "ram"
var userAge = 23

const printUserData = (a)=>{
    console.log("print userdata function called from user,js file",a)
}
module.exports = {
    userName,userAge,printUserData
}

