const mongoose = require('mongoose');
const ObjectID = require("mongoose").Types.ObjectId;

const PostSchema=new mongoose.Schema(
    {
        posterId:{
            type:ObjectID,
            ref:"user",
            required:true
        },
        visible:{type: String},
        texte:{
            type:String,
            trim:true,
            maxlength:1000000,
        },
        localisation:{
            type:String,
            maxlength:1000000,
        },
        media: {
            type:ObjectID,
            ref:"album"
        },



        likers:{
            type:[ObjectID],
            ref:"user"
        },
        likescomment:[{
            userId:String,
            //userId:String,
            commentaireId:String,

        }],
        repandComent:[{
            msg:String,
            commantaireId:String,
            userId:String,
            userPseudo:String,
            timestamp:Number}],
        likesRepand:[{
            userId:String,
            repandId:String,

        }],
        comments:{
            type:[{
                commenterId: {type:ObjectID,ref:"user"},
                textcomment:String,
                timestamp:Number
            }]
        },

        accestopost:{
            type:[String]
        },
        partage:{type:[
                {
                    user: {type:ObjectID,ref:"user"},
                    timestamp:Number
                }

            ]},
        tags:{type:[
                {
                    idPost:String,
                    idUsersend:String,
                    idUserReceve:String,
                    timestamp:Number
                }

            ]}


    },
    {timestamps:true}
);
module.exports=mongoose.model('post',PostSchema);