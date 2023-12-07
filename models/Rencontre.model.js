const mongosse = require("mongoose");
const {ObjectId}= mongosse.Schema;
const RencontreSchema = new mongosse.Schema(
    {
        userID:{
            type:ObjectId,
            ref:"user"
        },
        Activite:{
            libre:Boolean,
            certification:Boolean,
            enligne:Boolean,
            typecompte:String

        },
        Infos:{
            DomainePro:[String],
            Age:[Number],
            Genre:[String],
            OrientationSexuelle:[String],
            Origine:[String],
            SigneZodiacale:[String]

        },
        Localisation:{
            Rayon:Number,
            Localite:{
                pays:String,
                ville:String,
                Region:String
            }

        },
        ValeursEtRecherches:{
            valeurs:[String],
            Relations:[String]

        },
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
        }
    },{
    timestamps:true
    }

);
module.exports=mongosse.model('rencontre',RencontreSchema);
