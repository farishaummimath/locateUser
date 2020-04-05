const mongoose = require('mongoose')

const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema
const pointSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  });
const userSchema = new Schema ({

    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
        maxlength: 128
    },
    tokens: [
        {
            token: {
                type: String
            },
            createdAt: {
                type: Date,
                default: new Date()
            }
        }
    ]
    ,  
    location: {
        type: pointSchema,
        required: true
    },
    incognito:{
        type: Boolean,
        default: false
    },

})
userSchema.index({ "location": "2dsphere" });

userSchema.pre('save',function(next){
    const user = this
    if(user.isNew){
        bcryptjs.genSalt(10)
            .then(salt=>{
                bcryptjs.hash(user.password,salt)
                    .then(encryptedPassword=>{
                        user.password = encryptedPassword
                        next()
                    })
            })
    } else {
        next()
    }

})

userSchema.statics.findByCredentials = function(username,password){
    const User = this
    return User.findOne({username})
        .then(user=>{
            if(!user){
                return Promise.reject({
                    errors: 'Invalid username/password'
                })
            }

            return bcryptjs.compare(password,user.password)
                .then(result=>{
                    if(result){
                       return Promise.resolve(user)
                    } else {
                       return Promise.reject({
                           errors: 'Invalid username/password'
                        })
                    }
                })
        })
        .catch(err=>{
           return Promise.reject(err)
        })

        
}

userSchema.methods.generateToken = function(coordinates){
    const user = this

    console.log('Location',coordinates)
    const tokenData = {
        _id: user._id,
        username: user.username,
        createdAt: new Date
    }

    const token = jwt.sign(tokenData,'json123')
    user.tokens.push({token})
    user.location={ 
        type: 'Point',
        coordinates:coordinates//[longitude,latitude]
    }
    return user.save()
        .then(user=>{
            return Promise.resolve(token)
        })
        .catch(err=>{
            return Promise.reject(err)
        })
}

userSchema.statics.findByToken = function(token){
    const User = this
    let tokenData
        try {
           tokenData = jwt.verify(token,'json123')
        }
        catch(err) {
            return Promise.reject(err)
        }

        return User.findOne({
            _id: tokenData._id,
            'tokens.token': token
        })
}
const User = mongoose.model('User',userSchema)

module.exports = User 