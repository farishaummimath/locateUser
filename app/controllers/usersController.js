const User = require('../models/user')
const fs = require('fs')
const fastcsv = require("fast-csv");

module.exports.list=(req,res)=>{
    // strong parameters- serialize inputs
    
    User.find({})
   .then(users=>res.json(users))
   .catch(err=> res.json(err))
}

module.exports.register = (req,res) => {
    // const body = req.body
    // const user = new User(body)
    // user.save()
    //     .then(user=>{
    //         const {_id,username} = user
    //        res.json({_id,username})
    //     })
    //     .catch(err=>{
    //         res.json(err)
    //     })
    console.log(req)
    const file = req.file.filename
    let stream = fs.createReadStream(`./client/public/uploads/${file}`);
    // let csvData = [];
    let csvStream = fastcsv.parse()
    .on("data", function(data) {
            const obj = {
                username: data[0],
                password: data[1],
                place: data[2],
                location: { 
                    type: 'Point',
                    coordinates:[Number(data[3]),Number(data[4])]//[longitude,latitude]
                    }

            }
            User.findOne({username:data[0]})
            .then(user=>{
                if(user){
                    User.findOneAndUpdate({username:data[0]},obj,{new:true, runValidators:true})
                        .then(user=>console.log("user updated",user))
                        .catch(err=>console.log(err))
                } else {
                    const user =  new User(obj) 
                    user.save()
                        .then(user=>console.log("user saved",user))
                        .catch(err=>console.log(err))
                }
            })

      })
      
      .on("end", function() {
        console.log(" End of file import");
      })
      stream.pipe(csvStream);
      res.json({success : "Data imported successfully.", status : 200});
}


module.exports.login = (req,res) => {
    console.log('login',req.body)
    const body = req.body
    let user
    User.findByCredentials(body.username,body.password)
        .then(userFound => {
            
            user = userFound
            return user.generateToken(body.location)
        })
        .then(token=>{
            user = {_id:user._id,username:user.username,location:user.location}
            res.json({
                token,
                user
            })
        })
        .catch(err=>{
            res.json(err)
        })
}

module.exports.account = (req,res) => {
    console.log('------')
    const {_id,username} = req.user
    res.json({_id,username})
}
module.exports.nearby = (req,res) => {
    console.log('neabry',req.user.location)
    // const {_id,username} = req.user
    const long = req.user.location.coordinates[0]
    const latt = req.user.location.coordinates[1]
    // res.json({_id,username})
        User.find({
            location: {
                $near: {
                 $maxDistance: 1000,
                 $geometry: {
                  type: "Point",
                  coordinates: [ long , latt]
                 }
                }
               }
              }).find((error, results) => {
               if (error) console.log(error);
               const users = results.filter(res=>res.username!=req.user.username)
               res.json(users)
        })
// }
}
module.exports.search = (req,res) => {
   console.log('---',req.body)
    // const {_id,username} = req.user
    User.findOne({
        location: {
            $near: {
             $geometry: {
              type: "Point",
              coordinates: [ req.body.longitude , req.body.latitude]
             }
            }
           }
          }).find((error, result) => {
           if (error) console.log(error);
           res.json(result)
    })    
// }
}
module.exports.logout = (req,res) => {
    const {user,token} = req
    User.findByIdAndUpdate(user._id,{$pull:{tokens:{token:token}}})
        .then(()=>{
            res.json({notice: 'successfully logged out'})
        })
        .catch(err=>{
            res.json(err)
        })
}
module.exports.toggle = (req,res) => {
   const id =  req.body._id
    User.findByIdAndUpdate(id,{incognito:!req.user.incognito},{new:true,runValidators:true})
        .then((user)=>{
            res.json(user)
        })
        .catch(err=>{
            res.json(err)
        })
}