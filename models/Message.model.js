const mongoose = require('mongoose');
const mongosse = require("mongoose");
const {ObjectId}= mongosse.Schema;
const MessageSchema=new mongoose.Schema(
    {
        conversationId:{
            type:ObjectId,
            ref:"Conversation"
        },
        sender:{
            type:ObjectId,
            ref:"user"
        },
        visible:{
            type:Boolean,
            default : false
        },
        message:{

                    like:{
                        type:Boolean,
                        default:false
                    },
                    timestamp:Number,
                    messages: {
                        type:String,
                    },
                    image: {
                        type:[
                            {
                                data: Buffer,
                                contentType:String,
                                timestamp:Number
                            }
                        ]
                    },




        },

    },
    {timestamps:true}



);
module.exports=mongoose.model('Message',MessageSchema);