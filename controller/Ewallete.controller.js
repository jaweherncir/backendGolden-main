const EwalletModel=require("../models/Ewallet.model");
const ObjectID = require("mongoose").Types.ObjectId;
const crypto = require('crypto');
module.exports.AddRIB=async (req,res)=>{
    const  {
        RibGenerale,Identite,NomFamille,Prenom,pays,dateNass,
        PreuveIdenetite,typeIdentite,
        DomiciliationTitulaire,AdresseComplete,ComplementAdress,CodePostal,ville,
        codeRib,bussnies
    }=req.body
    //const PhotoIdentite=req.files.PhotoIdentite[0].filename
    console.log(req.body)
    try {
        const Ewallet = await  EwalletModel.create ({ RibGenerale,Identite,NomFamille,Prenom,pays,dateNass,
            PreuveIdenetite,typeIdentite,
            DomiciliationTitulaire,AdresseComplete,ComplementAdress,CodePostal,ville,
            codeRib,bussnies
        })
        res.status(201).json({Ewallet: Ewallet});
    }
    catch (err){
        res.status(400).send({err});

    }
}
module.exports.deleteRIB=(req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    EwalletModel.findByIdAndRemove(req.params.id,
        (err,docs)=>{
            if(!err) res.send(docs)
            else console.log("delete  error:"+err);
        })

}
//ribe pro
module.exports.AddRIBPro=async (req,res)=>{
    const  {
        RibEventPro,Identite,NomFamille,Prenom,pays,dateNass,
        PreuveIdenetite,typeIdentite,
        DomiciliationTitulaire,AdresseComplete,ComplementAdress,CodePostal,ville,
        codeRib,bussnies,
        SerieEntreprise
    }=req.body
    //const PhotoIdentite=req.files.PhotoIdentite[0].filename
    console.log(req.body)
    try {
        const Ewallet = await  EwalletModel.create ({ RibEventPro,Identite,NomFamille,Prenom,pays,dateNass,
            PreuveIdenetite,typeIdentite,
            DomiciliationTitulaire,AdresseComplete,ComplementAdress,CodePostal,ville,
            codeRib,bussnies,
            SerieEntreprise
        })
        res.status(201).json({Ewallet: Ewallet});
    }
    catch (err){
        res.status(400).send({err});

    }
}
