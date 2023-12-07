const mongoose = require('mongoose');
const {ObjectId}= mongoose.Schema;
//monque image de cin  et Justificatifin ribgenerale
const ewalletSchema = new mongoose.Schema({
    RibGenerale:{
        intitule:String,
        Identite:{
            NomFamille:String,
            Prenom:String,
            pays:String,
            dateNass:Date,

        },
        PreuveIdenetite:{
            typeIdentite:String,
            recto:{type:[
                    {
                        data: Buffer,
                        contentType:String,
                        timestamp:Number
                    }
                ]},
            verso:{type:[
                    {
                        data: Buffer,
                        contentType:String,
                        timestamp:Number
                    }
                ]}

        },
        DomiciliationTitulaire: {

            AdresseComplete:String,
            ComplementAdress:String,
            CodePostal:Number,
            ville:String,
            pays:String,
            Justificatif:{type:[
                    {
                        data: Buffer,
                        contentType:String,
                        timestamp:Number
                    }
                ],
                default:"",
            }
        },
        iban:{
            type:String,
            maxLength:34,
            minLength:14
        },
        typedebussnies:String,
    },
    RibPro:{
        intitule:String,
        Identite:{
            NomFamille:String,
            Prenom:String,
            pays:String,
            dateNass:Date,

        },
        PreuveIdenetite:{
            typeIdentite:String,
            recto:{type:[
                    {
                        data: Buffer,
                        contentType:String,
                        timestamp:Number
                    }
                ]},
            verso:{type:[
                    {
                        data: Buffer,
                        contentType:String,
                        timestamp:Number
                    }
                ]}

        },
        DomiciliationTitulaire: {

            AdresseComplete:String,
            ComplementAdress:String,
            CodePostal:Number,
            ville:String,
            pays:String,
            Justificatif:{type:[
                    {
                        data: Buffer,
                        contentType:String,
                        timestamp:Number
                    }
                ],
                default:"",
            }
        },
        DomiciliationOrganisation: {

            AdresseComplete:String,
            ComplementAdress:String,
            CodePostal:Number,
            ville:String,
            pays:String,
            Justificatif:{type:[
                    {
                        data: Buffer,
                        contentType:String,
                        timestamp:Number
                    }
                ],
                default:"",
            }
        },
        numeroidentification:{
            type: String,
            value:String,
            minlength: 27
        },
        iban:{
            type:String,
            maxLength:34,
            minLength:14
        },
        typedebussnies:String,
    },
    CarteBencaire:{

    },
},{
    timestamps: true,
})
const EwalletModel = mongoose.model("ewallet", ewalletSchema);
module.exports = EwalletModel;