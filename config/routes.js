const express = require('express')
const router = express.Router()
const usersController = require('../app/controllers/usersController')
const {authenticateUser} = require('../app/middlewares/authentication')
const multer = require('multer')
const storage = multer.diskStorage({
    destination :(req, file, cb) => {
        console.log("storage",req,file)
        cb(null, './client/public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
      }
    
})

const upload = multer({ storage })
//Users CRUD
router.get('/users/',authenticateUser,usersController.list)

router.post('/users/register',authenticateUser,upload.single('file'),usersController.register)
router.post('/users/login', usersController.login)
router.get('/users/account',authenticateUser,usersController.account)
router.put('/users/toggle',authenticateUser,usersController.toggle)

router.get('/users/nearby',authenticateUser,usersController.nearby)
router.get('/users/search',authenticateUser,usersController.search)

router.delete('/users/logout',authenticateUser,usersController.logout)


module.exports = router