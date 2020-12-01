

module.exports = mongoose => {
    const uniqueValidator = require('mongoose-unique-validator');
    const jwt=require('jsonwebtoken');
    const bcrypt=require('bcrypt');
    const confiq=require('../../config/database.config').get(process.env.NODE_ENV);
    const salt=10;
    // var crypto = require('crypto')
    // var jwt = require('jsonwebtoken')
    // var secret = require()

    var UserSchema = new mongoose.Schema(
      {
        username: {type: String, lowercase: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid']},
        password: {type: String, required: [true, "can't be blank"]},
        // hash : String,
        // salt : String,
        role: String,
        token : String
      },
      { timestamps: true }
    );

    UserSchema.pre('save', function(next) {
      var user = this

      if(user.isModified('password')){
        bcrypt.genSalt(salt,(err,salt) => {
            if(err)return next(err);

            bcrypt.hash(user.password,salt,(err,hash) => {
                if(err) return next(err);
                user.password=hash;
                next();
            })

        })
      }
      else{
          next();
      }
    });

    UserSchema.pre('findByIdAndUpdate', function(next) {
      var user = this
      console.log("masuk")

      if(user.isModified('password')){
        bcrypt.genSalt(salt,(err,salt) => {
            if(err)return next(err);

            bcrypt.hash(user.password,salt,(err,hash) => {
                if(err) return next(err);
                user.password=hash;
                next();
            })

        })
      }
      else{
          next();
      }
    });

    UserSchema.methods.comparepassword = function(password,cb)  {
        // var user = this
        console.log(password)
        console.log(this.password)
        bcrypt.compare(password,this.password,(err,isMatch) => {
            if(err) return cb(err);
            cb(null,isMatch);
        });
    }

    UserSchema.methods.generateToken = function(cb) {
      var user =this;
      var token=jwt.sign(user._id.toHexString(),confiq.SECRET);
  
      user.token=token;
      user.save(function(err,user){
          if(err) return cb(err);
          cb(null,user);
      })
    }
  
    UserSchema.statics.findByToken = function(token,cb) {
      var user=this;
  
      jwt.verify(token,confiq.SECRET, (err,decode) => {
          user.findOne({"_id": decode, "token":token}, (err,user) => {
              if(err) return cb(err);
              cb(null,user);
          })
      })
    };

    UserSchema.methods.deleteToken = function(token,cb) {
      var user=this;
  
      user.update({$unset : {token :1}}, (err,user) => {
          if(err) return cb(err);
          cb(null,user);
      })
    }

    UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});
    // UserSchema.methods.setPassword = password => {
    //   this.salt = crypto.randomBytes(16).toString('hex');
    //   this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    // };
    // UserSchema.methods.validPassword = password => {
    //   var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    //   return this.hash === hash;
    // };
    const User = mongoose.model( "user", UserSchema );
  
    return User;
};