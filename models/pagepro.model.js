const mongoose = require("mongoose");
const {ObjectId}= mongoose.Schema;
const  PageproSchema=new mongoose.Schema({
    nom:{
        type:String
    },
    userRef:{
        type:ObjectId,
        ref:'user'
    },
    categories:{
        categorie:String,
        souscategorie:String
    },
    information:{
        email:String,
        adressesite:String
    },
    pourboire:{
        type:Boolean
    },
    messagerie:{
        type:String

    },
    visibilite:{
        type:Boolean
    },
    localisation:{
        type:[String]
    },
    avatar:{
        data: Buffer,
        contentType:String,
        timestamp:Number
    },
    banniere:{
            data: Buffer,
            contentType:String,
            timestamp:Number
    },
    abonnes:[{
        type:ObjectId,
        ref:"user"
    }],
    pourboires:{
        type:Number,
        default:0
    },
    informations:{
        type:String
    },
},{
    timestamps:true
});
module.exports=mongoose.model('pagepro',PageproSchema);