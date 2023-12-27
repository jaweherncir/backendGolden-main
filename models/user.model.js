const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require("bcrypt");
const ObjectID = require("mongoose").Types.ObjectId;


const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String,
            maxlength: 10,
            unique: true,
            required:true
            //trim: true //supprimer les espace
        },
        prenom:{
            type:String
        },
        verifier:{type:Boolean,default:false},
        nom:{
            type:String
        },
        dateNass:Date,
        age:Number,
        email: {
            type: String,
              lowercase: true,
              trim: true,
        },
        numero:{type:String,default: ""},
        password: {
            type: String,
            max: 1024,
            default: ""
        },
        codeParinage:{type:Number},
        petitRapel:{type:String},
        PourFinir:{type:String},
        step1mailSended:{type:Boolean,default:false},
        bannerCompte:{type:Boolean,default:false},
        compteRefuser:{type:Boolean,default:false},
    
        photo:{
           type:String,
            ref:"album",
            default: ""// Adding default value as Date.now

        },

        couvertir:{
            type:String,
            ref:"album"
        },

        genre:[String],

        orientationsexe:{
            type:[String]

        },

        langue:{
            type:[String]
        },
        villeconnue:{
            type:[String]
        },

        orgine:{
            type:[String]
        },
        signeastrologique:{type:[String]},
        ascendant:{type:[String]},
        domainepro:{type:[String]},


        metier:{
            type:[String]
        },

        attirance:{
            type:[String]
        },

        relationRechercher:{
            type:[String]
        },
        valeur:{
            type:[String]
        },
        interet:{
            type:[String]
        },
        musique:{
            type:[String]
        },
        caractere:{
            type:[String]
        },
        personalite:{
            type:[String]
        },

        sihloutte:{
            type:[String]
        },
        certificat: [
            {
                certif: {
                    type: String,
                    // Other properties or validations for the certification photo if needed
               
                },
                etat: {
                    type: String,
                    enum: ['NON', 'OUI', 'EN COURS'],
                    default: 'NON' // Set default status as 'non' if not specified
                  }
            }
        ],
        lastEmailSentAt: {
            type: Date, // Store the timestamp as a Date
            default: null // Set default as null or a default timestamp if needed
          },
        etape1:{
            pseudopro:String,
            siteinternet:String,
            instagramacount:String

        },
        etape2:{
            rep1:String,
            rep2:String

        },
        etape3:{
            rep1:String,
            rep2:String

        },
        etape4:{
            rep1:String,
            rep2:String
        },
        etape5:{
            rep1:String

        },



        vip:{  type: Boolean,
            default: false
        },
        libre:{  type: Boolean,
            default: true
        },
        visibile:{  type: Boolean,
            default: true
        },
        friends:{
            type:[ObjectID],
            ref:"user"

        },
        blocked:{
            type:[ObjectID],
            ref:"user",
            timestamp:true

        },
        retirer:{
            type:[ObjectID],
            ref:"user",
            timestamp:true
        },

        likes: {
            type: [String] // les pub qui deja likes par user  metter un quere rouge comme si deja likeee
        },
        status: {
            type: Boolean,
            default: false
        },
        deactivate: {  type: Boolean , default: false },
        resetPasswordLink: {
            data: String,
            default: ""
        },
        prologue:String,
        Apparence:{
            taille:[Number],
            silhouette:[String],
            yeux:[String],
            cheveux:[String],
            pilositeCorporelle:[String],
            pilositeFaciale:[String]

        },
        DetailsPhysique:{
            Tatouage:[String],
            PiercingCorporel:[String],
            PiercingFacial:[String],

        },
        Personnalite:{
            Temperament:[String],
            Sociabilite:[String],
            Caractere:[String]

        },
        Habitude:{
            RythmeDeSoir:[String],
            Alcool:[String],
            Cigarette:[String],
            RegimeAlimentaire:[String],
            Hobbies:[String],
            GoutsMusicaux:[String],
        },
        lettredor:{
            type:Number,
            default:10
        },
        albumacces:{
            type:[
                {
                    _id:{type:ObjectID,ref:"user"},
                    timestamp:Number,
                    duree:Date
                }
            ]
        }
    }
    ,
    {
        timestamps: true,
    }
);


//play function before save into display : 'block'
/*userSchema.pre("save", async function(next) {
    const  salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
});//avant faire le save dans la base de donne faire cette function*/
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email }).populate({path:'photo',select:['picture']});
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;

