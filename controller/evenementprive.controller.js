const EvenementPriveModel= require("../models/evenementprive");
const NotificationsModel= require("../models/notifications.model");
const InvitationModel=require("../models/invitation.model");
const UserModel=require("../models/user.model");
const {json} = require("express");
const ObjectID = require("mongoose").Types.ObjectId;
const {EventProPrixSoloDuoErrors}=require('../utils/errors.utils');
const EvenementProModel = require("../models/evenementpro");
const fs = require("fs");
module.exports.createEvenementPrive = async (req, res) => {
    const {vip,userID} = req.body

    try {
        const eventprive = await EvenementPriveModel.create({vip,userID});
        res.status(201).send(eventprive);
    }
    catch(err) {
        res.status(200).send({ err })
    }
}
module.exports.createEvenementPriveSansPrivente = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementPriveModel.findByIdAndUpdate(
            {_id: req.params.id},
            //id d personne qui faire labonne
            {
                $set: {
                    prevente: req.body.prevente
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new: true, upsert: true},
            (err, data) => {
                if (!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }
        );

    }catch (err){
        return res.status(400).json({message:err});
    }
}
module.exports.createEvenementPriveAvecPrivente = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementPriveModel.findByIdAndUpdate(
            {_id: req.params.id},
            //id d personne qui faire labonne
            {
                $set: {
                    prevente: req.body.prevente
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new: true, upsert: true},
            (err, data) => {
                if (!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }
        );

    }catch (err){
        return res.status(400).json({message:err});
    }
}
module.exports.createEvenementPriveNom = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)  )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementPriveModel.findByIdAndUpdate(
            {_id:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    nom:req.body.nom

                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,eventpro) =>{
                if(!err)
                    return res.status(201).json(eventpro);
                else return res.status(400).json(err);
            }
        );
    }catch (err){
        return res.status(400).json({message:err});

    }

}
module.exports.createEvenementPrivePhotoBaniere=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await EvenementPriveModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    banniere:{
                        data:fs.readFileSync("client/event/prive/"+req.file.filename),
                        contentType:"image/jpg",
                        timestamp:new Date().getTime()
                    }

                }
            },
            {new: true, upsert: true, setDefaultsOnInsert:true},
            (err,data) =>{
                if (!err) return res.send(data);
                if (err) return  res.status(500).send({message: err});
            }
        )
    }catch(err) {

        return res.status(500).json({message: err});
    }


}

module.exports.createEvenementPriveLieux = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)  )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        if (req.body.visibilite==false){
            await EvenementPriveModel.findByIdAndUpdate(
                {_id:req.params.id},
                //id d personne qui faire labonne
                {
                    $set : {
                        localisation:{
                            lieu:req.body.lieu,
                            visibilite:req.body.visibilite,
                            periode:req.body.periode

                        }

                    } //$pull reterai (-) dun valeur specifique denattribut following
                }, //id de personne qui elle suivi
                {new :true , upsert: true},
                (err,eventpro) =>{
                    if(!err)
                        return res.status(201).json(eventpro);
                    else return res.status(400).json(err);

                }

            );
        }
        else {
            await EvenementPriveModel.findByIdAndUpdate(
                {_id:req.params.id},
                //id d personne qui faire labonne
                {
                    $set : {
                        localisation:{
                            lieu:req.body.lieu,
                            visibilite:req.body.visibilite,

                        }

                    } //$pull reterai (-) dun valeur specifique denattribut following
                }, //id de personne qui elle suivi
                {new :true , upsert: true},
                (err,eventpro) =>{
                    if(!err)
                        return res.status(201).json(eventpro);
                    else return res.status(400).json(err);

                }

            );
        }


    }catch (err){
        return res.status(400).json({message:err});

    }

}
module.exports.createEvenementPriveDateDebut = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)  )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementPriveModel.findByIdAndUpdate(
            {_id:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    datedebut:new Date(req.body.datedebut)
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,eventpro) =>{
                if(!err)
                    return res.status(201).json(eventpro);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});

    }

}
module.exports.createEvenementPriveDateFin = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)  )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementPriveModel.findByIdAndUpdate(
            {_id:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    datefin:new Date(req.body.datefin)
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,eventpro) =>{
                if(!err)
                    return res.status(201).json(eventpro);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});

    }

}
module.exports.createEvenementPriveParticipantLanguageParle= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementPriveModel.findByIdAndUpdate(
            {_id:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    langues:req.body.langues
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.createEvenementPriveParticipantGenreConcernnes= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementPriveModel.findByIdAndUpdate(
            {_id:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    GenreConcernes:req.body.genre
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.createEvenementPriveParticipantSexualiteConcernnes= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementPriveModel.findByIdAndUpdate(
            {_id:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    SexualiteeConcernes:req.body.sexualite
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.createEvenementPriveTypeDeSoireeAddCategorie= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        let tabcategoriies=req.body.categories
        if (tabcategoriies.length>4)
            return res.status(400).json({eroors:"Selectionner 4 Categories Maximum"});
        else {
            await EvenementPriveModel.findByIdAndUpdate(
                {_id: req.params.id},
                //id d personne qui faire labonne
                {
                    $set: {
                        "typedesoiree.categories": req.body.categories
                    } //$pull reterai (-) dun valeur specifique denattribut following
                }, //id de personne qui elle suivi
                {new: true, upsert: true},
                (err, data) => {
                    if (!err)
                        return res.status(201).json(data);
                    else return res.status(400).json(err);

                }
            );
        }
    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.createEvenementPriveTypeDeSoireeAddAmianceMusicales= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementPriveModel.findByIdAndUpdate(
            {_id: req.params.id},
            //id d personne qui faire labonne
            {
                $set: {
                    "typedesoiree.ambiance_musicales": req.body.musique
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new: true, upsert: true},
            (err, data) => {
                if (!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }
        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.createEvenementPriveTypeDeSoireeAddDescripition= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementPriveModel.findByIdAndUpdate(
            {_id: req.params.id},
            //id d personne qui faire labonne
            {
                $set: {
                    "typedesoiree.description": req.body.description
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new: true, upsert: true},
            (err, data) => {
                if (!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }
        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.createEvenementPriveTypeDeSoireeAddDressCode= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementPriveModel.findByIdAndUpdate(
            {_id: req.params.id},
            //id d personne qui faire labonne
            {
                $set: {
                    "typedesoiree.dresscode": req.body.dresscode
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new: true, upsert: true},
            (err, data) => {
                if (!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }
        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.createEvenementPriveParametres= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementPriveModel.findByIdAndUpdate(
            {_id: req.params.id},
            //id d personne qui faire labonne
            {
                $set: {
                    parametres: {
                        selection: req.body.selection,
                        visibilite: req.body.visibilite,
                        journal: req.body.journal

                    }
                }//$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new: true, upsert: true},
            (err, data) => {
                if (!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }
        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.createEvenementPriveAvecPreventeParametres= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementPriveModel.findByIdAndUpdate(
            {_id: req.params.id},
            //id d personne qui faire labonne
            {
                $set: {
                    parametres: {
                        selection: req.body.selection,
                        visibilite: req.body.visibilite,
                        journal: req.body.journal,
                        tva_ticket:req.body.tva

                    }
                }//$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new: true, upsert: true},
            (err, data) => {
                if (!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }
        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.createEvenementPriveParametresChoisirRole= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementPriveModel.findByIdAndUpdate(
            {_id: req.params.id},
            //id d personne qui faire labonne
            {
                $set: {
                    "parametres.autorisation": req.body.autorisation
                }//$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new: true, upsert: true},
            (err, data) => {
                if (!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }
        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.createEvenementPriveAvecPreventeAvantage= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementPriveModel.findByIdAndUpdate(
            {_id: req.params.id},
            //id d personne qui faire labonne
            {
                $addToSet: {
                    avantages: {
                        titre:req.body.titre,
                        prix:req.body.prix,
                        tva:req.body.tva,
                        stock:req.body.stock,
                        quantitemax:req.body.quantitemax,
                        description:req.body.description

                    }
                }//$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new: true, upsert: true},
            (err, data) => {
                if (!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }
        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.createEvenementPriveAvecPreventeUpdateAvantage= async (req,res) =>{
    if (!ObjectID.isValid(req.params.idevent) && !ObjectID.isValid(req.params.idavantage) )
        return res.status(400).send('ID unknown '+req.params.idevent);
    try {
        await EvenementPriveModel.findOneAndUpdate(
            {_id:req.params.idevent,
                avantages:{$elemMatch:{_id:req.params.idavantage}}},
            //id d personne qui faire labonne
            {
                $set: {
                    'avantages.$.titre':req.body.titre,
                    'avantages.$.prix':req.body.prix,
                    'avantages.$.tva':req.body.tva,
                    'avantages.$.stock':req.body.stock,
                    'avantages.$.quantitemax':req.body.quantitemax,
                    'avantages.$.description':req.body.description
                }//$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new: true, upsert: true},
            (err, data) => {
                if (!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }
        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.createEvenementPriveAvecPreventeDeleteAvantage= async (req,res) =>{
    if (!ObjectID.isValid(req.params.idevent) && !ObjectID.isValid(req.params.idavantage) )
        return res.status(400).send('ID unknown '+req.params.idevent);
    try {
        await EvenementPriveModel.findOneAndUpdate(
            {_id:req.params.idevent},
            //id d personne qui faire labonne
            {
                $pull: {
                    avantages:{_id:req.params.idavantage}
                }//$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new: true},
            (err, data) => {
                if (!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }
        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}

module.exports.createEvenementPrivePubliez= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementPriveModel.findByIdAndUpdate(
            {_id: req.params.id},
            //id d personne qui faire labonne
            {
                $set: {
                    publiez: req.body.publiez
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new: true, upsert: true},
            (err, data) => {
                if (!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }
        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.createEvenementPrivePrixSoloDuo = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)  )
        return res.status(400).send('ID unknown '+req.params.id);

    const {prixsolo,prixduo}=req.body
    await EvenementPriveModel.findByIdAndUpdate(
        {_id:req.params.id},
        //id d personne qui faire labonne
        {
            prixsolo,
            prixduo
        },{
            new:true,
            runValidators:true,
            context:'query'
        }).then((prixsoloduo)=>{
        res.json(prixsoloduo)
    }).catch((err)=> {
        const errors = EventProPrixSoloDuoErrors(err);
        //console.log(errors)
        res.status(400).send({errors});
        //next(err);

    });
}

module.exports.getAllEvenetPrive=async (req,res)=>{
    EvenementPriveModel.find((err,data) =>{
        if (!err)
            res.send(data);
        else
            console.log("Error to get data : "+err) ;
    });
}
module.exports.getEventPriveByID=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id);

    EvenementPriveModel.findById(req.params.id, (err,data)=>{
        if(!err)
            res.send(data);
        else
            console.log('ID unknow : '+err);

    });
}
module.exports.DeleteEventPrive = async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("Id unknow : "+req.params.id);
    try {
        await EvenementPriveModel.findByIdAndRemove(
            req.params.id,
            (err,data)=>{
                if(!err)
                    res.status(200).send({result:"succes delete"});
                else
                    res.status(401).send({result:"delete error :"+err});
                //console.log("delete error : "+err);
            }
        );

    }catch (err)
    {
        return res.status(500).json({message: err});
    }


}




