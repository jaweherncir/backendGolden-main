const mongoose = require("mongoose");
const {isValidObjectId} = require("mongoose");
const {ObjectId}= mongoose.Schema;
const NotificationsSchema = new mongoose.Schema(
    {
        userID:{
            type:ObjectId,
            ref:"user",
            required: true
        },
        Interaction:{
            type:[
                {
                    usersenderid:{type:ObjectId,ref:"user"},
                    vunotif:{type:Boolean,default:false},
                    timestamp:Number,
                    model:String,
                    text:String

                }
            ],
        },
        Coeur:{
            type:[
                {
                    usersenderid:{type:ObjectId,ref:"user"},
                    postid:{type:ObjectId,ref:"post"},
                    vunotif:{type:Boolean,default:false},
                    timestamp:Number,
                    model:String,
                    text:String

                }
            ],
        },
        Evenement:{
            type:[
                {
                    usersenderid:{type:ObjectId,ref:"user"},
                    vunotif:{type:Boolean,default:false},
                    timestamp:Number,
                    model:String,
                    text:String

                }
            ],
        },
        Message:{
            type:[
                {
                    usersenderid:{type:ObjectId,ref:"user"},
                    message:{type:ObjectId,ref:"message"},
                    postid:{type:ObjectId,ref:"post"},
                    commentid:{type:ObjectId,ref:"post"},
                    vunotif:{type:Boolean,default:false},
                    timestamp:Number,
                    model:String,
                    text:String

                }
            ],
        },
        /*postlike:{
            type:[
                {
                    postid: {type:ObjectId,ref:"post"},
                    likerid:ObjectId,
                    vunotif:{type:Boolean , default:false},
                    timestamp:Number

                }
            ],
        },
        postcomment:{
            type:[
                {
                    postid:{type:ObjectId,ref:"post"},
                    commenterid:{ObjectId},
                    vunotif:{type:Boolean , default:false},
                    timestamp:Number,
                    type:String

                }

            ],
        },
        eventementPartition:{
            type:[
                {
                    eventementid:ObjectId,
                    participantid: {type:ObjectId,ref:"user"},
                    vunotif:{type:Boolean, default:false},
                    timestamp:Number
                }
            ],
        },
        friendsreciver:{
            type:[
                {
                    usersenderid:{type:ObjectId,ref:"user"},
                    vunotif:{type:Boolean,default:false},
                    timestamp:Number

                }

            ],
        },
        jumlagereciver:{
            type:[
                {
                    usersenderid: {type:ObjectId,ref:"user"},
                    vunotif:{type:Boolean,default:false},
                    timestamp:Number

                }

            ],
        },
        demandepubreciver:{
            type:[
                {
                    postid:{type:ObjectId,ref:"post"},
                    usersenderid:{type:ObjectId,ref:"user"},
                    vunotif:{type:Boolean , default:false},
                    timestamp:Number

                }

            ],
        },//evenement invitation , acces to media
        messagereciver:{
            type:[
                {
                    usersenderid: {type:ObjectId,ref:"user"},
                    message:{ type:ObjectId, ref:"message"},
                    vunotif:{type:Boolean,default:false},
                    timestamp:Number

                }
            ],
        },
        reciverAccesAlbum:{
            type:[
                {
                    usersenderid: {type:ObjectId,ref:"user"},
                    vunotif:{type:Boolean,default:false},
                    duree:Number,
                    timestamp:Number
                }
            ],
        }*/

    }
);
module.exports=mongoose.model('notifications',NotificationsSchema);