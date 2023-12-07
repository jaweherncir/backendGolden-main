const mongosse = require("mongoose");
//const mongoose = require("mongoose");
const {ObjectId}= mongosse.Schema;
const EvenementProSchema= new mongosse.Schema(

    {
        vip:{
            type:Boolean
        },
        prevente:{
            type:Boolean,
            default:true
        },
        pagepro:{
          type:ObjectId,
            ref:"pagepro"
        },
        userID:{
            type:ObjectId,
            ref:"user"

        },
        RIB:{
            type:String
        },

        nom:{
            type:String
        },
        banniere:{
            data: Buffer,
            contentType:String,
            timestamp:Number
        },
        localisation:{
            type:{
                lieu:String,
                visibilite:Boolean,
                periode:Number
            }
        },
        datedebut:{
            type:Date

        },
        datefin:{
            type:Date

        },
        prixsolo:{
            type:Number,
            min:5,

        },
        prixduo:{
            type:Number,
            min:5

        },
        gagnote:{
            type:Number,
            default:0
        },
        participants:{
            invitees:{type:Number,default:0},
            requetes:{type:Number,default:0},
            inscrites:{type:Number,default:0},

            ratio:{}


        },
        langues:[String],
        GenreConcernes:[String],
        SexualiteeConcernes:[String],
        typedesoiree:{
            categories:[String],
            ambiance_musicales:[String],
            description:String,
            dresscode:String

        },
        parametres:{
            selection:String,
            visibilite:String,
            journal:[String],
            tva_ticket:Number,
            autorisation:[{
                userRef:{type: ObjectId, ref:'user'},
                role:String
            }]
        },
        journal:{

        },
        avantages:{
            type:[
                {
                    titre:String,
                    prix:Number,
                    tva:Number,
                    stock:Number,
                    quantitemax:Number,
                    description:String,

                }
            ]

        },
        publiez:{type:Boolean,default:false},
        requetes:{
            type:[ObjectId]
        },
        inscrites:{
            type:[ObjectId]

        },
        invitees:{
            type:[ObjectId]
        }




    },{
        timestamps:true

    }

);
module.exports=mongosse.model('evenementpro',EvenementProSchema);