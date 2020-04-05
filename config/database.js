const mongoose = require('mongoose')

// mongoose connection configuration
const setupDB = ()=>{
    mongoose.connect('mongodb://localhost:27017/locate-user-app-new',{ useNewUrlParser: true ,useUnifiedTopology: true })
    .then(()=>{
        console.log('connected to db')
    })
    .catch((err)=>{
        console.log('ERROR',err)
    })
}

module.exports = setupDB