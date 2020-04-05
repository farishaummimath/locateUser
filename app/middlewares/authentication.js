const User = require('../models/user')
const authenticateUser = function(req,res,next){
    console.log(req)
    const token = req.header('x-auth')
    User.findByToken(token)
        .then(function(user){
            //res.send(user)
            if(user){
                req.user = user
                req.token = token
                next()
            } else {
                res.status('401').send({notice:'Token  not found'})
            }
            
        })
        .catch(function(err){
            res.status('401').send(err)
        })
}
const authorizeUser = (req,res,next)=>{
    if(req.user.role == 'admin'){
        next()
    } else {
        res.status('403').json({'notice':"You are not authorised"})
    }
}
module.exports = {
    authenticateUser,
    authorizeUser
}