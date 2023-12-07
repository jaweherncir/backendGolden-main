const mongoose = require("mongoose");
const ObjectID = require("mongoose").Types.ObjectId;

const AlbumSchema=new mongoose.Schema(
    {
        userId:{
            type:ObjectID,
            ref:"user"
        },
        visible:{
            type: Boolean,
            default: true
        },
        picture:[{
                    data: Buffer,
                    contentType:String,
                    timestamp:Number
        }],

    },{
        timestamps:true
    }

);
module.exports=mongoose.model('album',AlbumSchema);