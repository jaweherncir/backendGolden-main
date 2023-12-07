const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const jumlageSchema= new mongoose.Schema(
    {
        userdemandejum:{
            type:ObjectId,
            ref:"user"
        },
        useracceptjum:{
            type:ObjectId,
            ref:"user"
        }
    },
    {
        timestamps:true
    }

);


const JumlageModel = mongoose.model("jumlage",jumlageSchema);
module.exports = JumlageModel;
