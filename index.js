const express = require('express')
const router = require('./config/routes')
const setupDB = require('./config/database')
const cors = require('cors')
const port = 4005


const app = express()


setupDB()

app.use(express.json())
app.use(cors())

app.use('/',router)

app.listen(port, ()=>{
    console.log('Listening to port: ', port)
})
   