const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema(
    {
        userId: {type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
        serviceName: {type:String,required:true},
        serviceId:  {type:String,required:true,unique:true},
        encryptedPassword: {type:String,required:true},
        createdAt : {type:Date,default:Date.now}
    }
);

const Password = mongoose.model("Password",passwordSchema);
module.exports = Password