const EvenementPriveModel= require("../models/evenementprive");
const EvenementProModel= require("../models/evenementpro");
const NotificationsModel= require("../models/notifications.model");
const InvitationModel=require("../models/invitation.model");
const UserModel=require("../models/user.model");
const {json} = require("express");
const ObjectID = require("mongoose").Types.ObjectId;
const {EventProPrixSoloDuoErrors}=require('../utils/errors.utils');
const PageProModel = require("../models/pagepro.model");
const fs = require("fs");
const userModel = require("../models/user.model");
const moment = require("moment/moment");
//creation event pro
module.exports.createEvenementPro = async (req, res) => {
    const {vip,userID} = req.body

    try {
        const eventpro = await EvenementProModel.create({vip,userID});
        res.status(201).send( eventpro);
    }
    catch(err) {
        res.status(200).send({ err })
    }
}
module.exports.createEvenementProPageProRIB = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)  || !ObjectID.isValid(req.body.pagepro) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementProModel.findByIdAndUpdate(
            {_id:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    pagepro:req.body.pagepro,
                    RIB:req.body.rib

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
module.exports.createEvenementProNom = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)  )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementProModel.findByIdAndUpdate(
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
module.exports.createEvenementProPhotoBaniere=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await EvenementProModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    banniere:{
                        data:fs.readFileSync("client/event/pro/"+req.file.filename),
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

module.exports.createEvenementProPrixSoloDuo = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)  )
        return res.status(400).send('ID unknown '+req.params.id);

        const {prixsolo,prixduo}=req.body
        await EvenementProModel.findByIdAndUpdate(
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
module.exports.createEvenementProLieux = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)  )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        if (req.body.visibilite==false){
            await EvenementProModel.findByIdAndUpdate(
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
            await EvenementProModel.findByIdAndUpdate(
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
module.exports.createEvenementProDateDebut = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)  )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementProModel.findByIdAndUpdate(
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
module.exports.createEvenementProDateFin = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)  )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementProModel.findByIdAndUpdate(
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
module.exports.createEvenementProParticipantLanguageParle= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementProModel.findByIdAndUpdate(
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
module.exports.createEvenementProParticipantGenreConcernnes= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementProModel.findByIdAndUpdate(
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
module.exports.createEvenementProParticipantSexualiteConcernnes= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementProModel.findByIdAndUpdate(
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
module.exports.createEvenementProTypeDeSoireeAddCategorie= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        let tabcategoriies=req.body.categories
        if (tabcategoriies.length>4)
            return res.status(400).json({eroors:"Selectionner 4 Categories Maximum"});
        else {
            await EvenementProModel.findByIdAndUpdate(
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
module.exports.createEvenementProTypeDeSoireeAddAmianceMusicales= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
            await EvenementProModel.findByIdAndUpdate(
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
module.exports.createEvenementProTypeDeSoireeAddDescripition= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementProModel.findByIdAndUpdate(
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
module.exports.createEvenementProTypeDeSoireeAddDressCode= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementProModel.findByIdAndUpdate(
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
module.exports.createEvenementProParametres= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementProModel.findByIdAndUpdate(
            {_id: req.params.id},
            //id d personne qui faire labonne
            {
                $set: {
                    parametres: {
                        selection: req.body.selection,
                        visibilite: req.body.visibilite,
                        journal: req.body.journal,
                        tva_ticket: req.body.tva

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
module.exports.createEvenementProParametresChoisirRole= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementProModel.findByIdAndUpdate(
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
module.exports.createEvenementProAvantage= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementProModel.findByIdAndUpdate(
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
module.exports.createEvenementProUpdateAvantage= async (req,res) =>{
    if (!ObjectID.isValid(req.params.idevent) && !ObjectID.isValid(req.params.idavantage) )
        return res.status(400).send('ID unknown '+req.params.idevent);
    try {
        await EvenementProModel.findOneAndUpdate(
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
module.exports.createEvenementProDeleteAvantage= async (req,res) =>{
    if (!ObjectID.isValid(req.params.idevent) && !ObjectID.isValid(req.params.idavantage) )
        return res.status(400).send('ID unknown '+req.params.idevent);
    try {
        await EvenementProModel.findOneAndUpdate(
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

module.exports.createEvenementProPubliez= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await EvenementProModel.findByIdAndUpdate(
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

/*
module.exports.createEvenementPro= async (req,res) =>{
    const newevenet = new EvenementProModel({
        pagepro:req.body.pagepro,
        userID:req.body.userID,
        RIB:req.body.rib,
        nom:req.body.nom,
        localisation:{
            longitude:req.body.localisation.longitude,
            latitude:req.body.localisation.latitude,
            lieu:req.body.localisation.lieu
        },
        datedebut:req.body.datedebut,
        datefin:req.body.datefin,
        prixsolo:req.body.prixsolo,
        prixduo:req.body.prixduo,
        gagnote:req.body.gagnote,
        participants:{
            invitees:req.body.participants.invitees,
            requetes:req.body.participants.requetes,
            inscrites:req.body.participants.inscrites,
            langues:req.body.participants.langues,
            ratio:req.body.participants.ratio,
            dresscode:req.body.participants.dresscode


        },
        informations:{
            categorie:req.body.informations.categorie,
            ambiance_musicales:req.body.informations.ambiance_musicales,
            description:req.body.informations.description


        },
        parametres:{
            selection:req.body.parametres.selection,
            visibilite:req.body.parametres.visibilite,
            journal:req.body.parametres.journal,
            autorisation:req.body.parametres.autorisation
        },
        journal:{},
        avantages:req.body.avantages
    });
    try {
        const evenement = await newevenet.save();
        return res.status(201).json(evenement)
    }catch (err){
        return res.status(400).send(err);

    }

}
*/
//creation event prive sans privenete

module.exports.invitationEvenement= async (req,res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.participantid) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        // add to the follower liste
        await EvenementPriveModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $addToSet : {requetes: req.body.userinvitedid}
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );
       await NotificationsModel.findOneAndUpdate(
            {"userID":req.body.userinvitedid},
            {
                $addToSet : {
                    eventementPartition :{
                    eventementid:req.params.id,
                    participantid:req.body.participantid,
                    timestamp:new Date().getTime()
                    }
                }
                },
            {new: true, upsert:false},
            (err,data) =>{
                //if (!err) res.status(201).json(data); impossible de routerner deux repponse status
                if (err) return res.status(400).json(err);

            }
        );
    }catch (err){
        return res.status(500).js({message: err});

    }
}
module.exports.DeleteEventPro = async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("Id unknow : "+req.params.id);
    try {
        await EvenementProModel.findByIdAndRemove(
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
module.exports.getAllEvenetPro=async (req,res)=>{
    EvenementProModel.find((err,data) =>{
        if (!err)
            res.send(data);
        else
            console.log("Error to get data : "+err) ;
    });
}
module.exports.getEventProByID=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id);

    EvenementProModel.findById(req.params.id, (err,data)=>{
        if(!err)
            res.send(data);
        else
            console.log('ID unknow : '+err);

    });
}

module.exports.demandePartitipantEvenement= async (req,res)=>{
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idevent))
        return res.status(400).send("ID UNKNow"+req.params.id);
    try{
        await InvitationModel.findOneAndUpdate(
            {userID:req.params.id},
            {$addToSet:{
                    senderReqEvenementPart:{
                        _id:req.body.idevent,
                        timestamp:new Date().getTime()
                    }

                }},
            {new :true},
            (err,data)=>{
                if(!err)
                {
                     EvenementProModel.findByIdAndUpdate(
                        {_id:req.body.idevent},
                        {
                            $addToSet : {requetes: req.params.id}
                        }, //id de personne qui elle suivi
                        {new :true , upsert: false},
                        (err,data) =>{
                            if(err)
                                return res.status(400).json(err);
                               // res.status(201).json(data);
                            //else return res.status(400).json(err);

                        }

                    );
                    return  res.status(201).json(data);
                    //  console.log(data);
                }
                else
                    return res.status(401).json(err);
            }
        );
        // add to the notification evenet participant  liste

        /*await NotificationsModel.findOneAndUpdate(
            {"userID":req.params.id},
            {
                $addToSet : {
                    eventementPartition :{
                        eventementid:req.body.idevent,
                        participantid:req.params.id,
                        timestamp:new Date().getTime()
                    }
                }
            },
            {new: true, upsert:false},
            (err,data) =>{
                //if (!err) res.status(201).json(data); impossible de routerner deux repponse status
                if (err) return res.status(402).json(err);

            }
        );*/
    }catch (err){
        return res.status(500).js({message: err});

    }

}
module.exports.InvitationnEvenementPro=async (req,res)=>{
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.userinvite))
        return res.status(400).send("ID UNKNow"+req.params.id);
    try{
        await InvitationModel.findOneAndUpdate(
            {userID:req.body.userinvite},
            {$addToSet:{
                    reciverReqEvenementPart:{
                        _id:req.params.id,
                        timestamp:new Date().getTime()
                    }

                }},
            {new :true},
            (err,data)=>{
                if(!err)
                {
                    EvenementProModel.findByIdAndUpdate(
                        {_id:req.params.id},
                        {
                            $addToSet : {invitees: req.body.userinvite}
                        }, //id de personne qui elle suivi
                        {new :true , upsert: false},
                        (err,data) =>{
                            if(err)
                                return res.status(400).json(err);
                            // res.status(201).json(data);
                            //else return res.status(400).json(err);

                        }

                    );
                    return  res.status(201).json(data);
                    //  console.log(data);
                }
                else
                    return res.status(401).json(err);
            }
        );
        // add to the notification evenet participant  liste

        await NotificationsModel.findOneAndUpdate(
            {"userID":req.body.userinvite},
            {
                $addToSet : {
                    eventementPartition :{
                        eventementid:req.params.id,
                        participantid:req.body.userinvite,
                        timestamp:new Date().getTime()
                    }
                }
            },
            {new: true, upsert:false},
            (err,data) =>{
                //if (!err) res.status(201).json(data); impossible de routerner deux repponse status
                if (err) return res.status(402).json(err);

            }
        );
    }catch (err){
        return res.status(500).js({message: err});

    }

}

async function getNombreParticipantInvitees(id)
{

    let nombreinv;
    const nbinvitees= await EvenementProModel.findById(id,(err,data)=>{
       if (!err)
           nombreinv=data.participants.invitees;
       else
           nombreinv=null;
    }).select('participants.invitees -_id');
    if (nbinvitees)
        return nombreinv;
    else
        throw Error('data indefined');

}
async function getNombreParticipantRequetes(id)
{

    let nombrereq;
    const nbrequestets= await EvenementProModel.findById(id,(err,data)=>{
        if (!err)
            nombrereq=data.participants.requetes;
        else
            nombrereq=null;
    }).select('participants.requetes -_id');
    if (nbrequestets)
        return nombrereq;
    else
        throw Error('data indefined');

}
async function getNombreParticipantInscrites(id)
{

    let nombreinscri;
    const nbinscrites= await EvenementProModel.findById(id,(err,data)=>{
        if (!err)
            nombreinscri=data.participants.inscrites;
        else
            nombreinscri=null;
    }).select('participants.inscrites -_id');
    if (nbinscrites)
        return nombreinscri;
    else
        throw Error('data indefined');

}
/*const jsoninvites=await getNombreParticipantInvitees(req.params.id);
const nbr=Number(jsoninvites)
console.log(nbr)*/

module.exports.getListParticipantInvites=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    //console.log(getAllInvites(req.params.id));
    try {
        await EvenementProModel.findById(req.params.id,(err,data)=>{
            if(!err)
                return res.send(data.invitees);
            else
                return res.status(401).send(err);
        }).select('invitees -_id');
    }catch (err){
        return res.status(500).json({message: err});
    }

}
module.exports.getListParticipantRequetes=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    //console.log(getAllInvites(req.params.id));
    try {
        await EvenementProModel.findById(req.params.id,(err,data)=>{
            if(!err)
                return res.send(data.requetes);
            else
                return res.status(401).send(err);
        }).select('requetes -_id');

    }catch (err){
        return res.status(500).json({message: err});
    }

}
module.exports.getListParticipantInscrits=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    //console.log(getAllInvites(req.params.id));
    try {
        await EvenementProModel.findById(req.params.id,(err,data)=>{
            if(!err)
                return res.send(data.inscrites);
            else
                return res.status(401).send(err);
        }).select('inscrites -_id');

    }catch (err){
        return res.status(500).json({message: err});
    }
}
module.exports.getAllNombreParticipant=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    //console.log(getAllInvites(req.params.id));
    try {
        let nbrinvit,nbrinscri,nbrrequetes

        const nbinvitees= await EvenementProModel.findById(req.params.id,(err,data)=>{
            if(!err)
                nbrinvit=data.invitees;
            else
                throw Error('data indefined');

        }).select('invitees -_id');
        const nbrequetes= await EvenementProModel.findById(req.params.id,(err,data)=>{
            if(!err)
                nbrrequetes=data.requetes;
            else
                throw Error('data indefined');

        }).select('requetes -_id');

       const nbinscrites= await EvenementProModel.findById(req.params.id,(err,data)=>{
           if(!err)
               nbrinscri=data.inscrites;
           else
               throw Error('data indefined');

        }).select('inscrites -_id');

        if (nbinvitees && nbrequetes && nbinscrites)
        {
            return res.status(200).json({
                invitees:nbrinvit.length,
                requetes:nbrrequetes.length,
                inscrites:nbrinscri.length});
        }else
            console.log("erreur lire data from database");

    }catch (err){
        return res.status(500).json({message: err});
    }

}
async function getAllInvites(id){
    const query=  await EvenementProModel.findById(id,(err,data)=>{}).select('invitees -_id');
    if (query)
        return query;
    else
        return null;

}
 async function getListFriendparuser(id){
     return await  UserModel.findById(id,(err,data)=>{}).select('friends -_id');

}
module.exports.getInviterContactetHorsContact= async (req,res)=>{
    if(!ObjectID.isValid(req.params.idevent) || !ObjectID.isValid(req.params.iduser))
        return res.status(400).send("ID UNKNow"+req.params.idevent+" ou "+req.params.iduser);
    try {
        const listeinvitte= await getAllInvites(req.params.idevent);
        const listefriends= await getListFriendparuser(req.params.iduser);
        const tablistefriends= JSON.parse(JSON.stringify(listefriends)).friends;
        const tablisteinvitees= JSON.parse(JSON.stringify(listeinvitte)).invitees;
        let amie=[]; //amie.push  pour ajouter
        let horsamie=[];// table invitte evenement - table amie
        if ((tablistefriends.length!= 0) && (tablisteinvitees.length!=0))
        {
            const  array3= tablistefriends.concat(tablisteinvitees);
            //console.log(array3);
            let sorted_arr = array3.slice().sort();
            //console.log(sorted_arr);
            for(let i=0;i<sorted_arr.length -1 ; i+=2){
                if (sorted_arr[i+1] === sorted_arr[i]){
                   amie.push(sorted_arr[i]);
                }
                else
                {
                    horsamie.push(sorted_arr[i],sorted_arr[i+1])
                }
            }
            if (amie.length!=0 || horsamie.length!=0)
            {
                return res.status(200).json({
                    friends:amie,
                    notfriends:horsamie
                });
            }
            /*console.log(amie);
            console.log("********")
            console.log(horsamie)*/
        }
        else  return res.status(201).json({message:"vide"});
    }catch (err){
        return res.status(400).send(err);
    }

}
module.exports.getAllEvent= async (req,res) =>{
    const eventprive = await EvenementPriveModel.find();//afiicher touts les information des users sauf password
    const eventpro = await EvenementProModel.find();//afiicher touts les information des users sauf password
    res.status(200).json({pro:eventpro,prive:eventpro});

}
module.exports.getAllCountEvent= async (req,res) =>{
    const eventprive = await EvenementPriveModel.find().countDocuments();//afiicher touts les information des users sauf password
    const eventpro = await EvenementProModel.find().countDocuments();//afiicher touts les information des users sauf password
    const allevent=eventpro+eventprive;
    res.status(200).json({result:allevent});

}
module.exports.getCountEventPArJour= async (req,res) =>{
    try {
        // var todayDate = new Date().toISOString().slice(0, 10);
        var start = moment().subtract(24, 'hours').toDate();
        //console.log(start)
        const eventprive = await EvenementPriveModel.find({ "createdAt" : { "$gte": start }}).countDocuments();//afiicher touts les information des users sauf password
        const eventpro = await EvenementProModel.find({ "createdAt" : { "$gte": start }}).countDocuments();//afiicher touts les information des users sauf password
        const allevent=eventpro+eventprive;
         res.status(200).json({result:allevent});

    }catch (err){
        return res.status(500).json({message: err});
    }


}
module.exports.getCountEventPArSemaine= async (req,res) =>{
    try {
        // var todayDate = new Date().toISOString().slice(0, 10);
        var start = moment().subtract(7, 'days').toDate();
        //console.log(start)
        const eventprive = await EvenementPriveModel.find({ "createdAt" : { "$gte": start }}).countDocuments();//afiicher touts les information des users sauf password
        const eventpro = await EvenementProModel.find({ "createdAt" : { "$gte": start }}).countDocuments();//afiicher touts les information des users sauf password
        const allevent=eventpro+eventprive;
        res.status(200).json({result:allevent});

    }catch (err){
        return res.status(500).json({message: err});
    }


}
module.exports.getCountEventPArMois= async (req,res) =>{
    try {
        // var todayDate = new Date().toISOString().slice(0, 10);
        var start = moment().subtract(1, 'months').toDate();
        //console.log(start)
        const eventprive = await EvenementPriveModel.find({ "createdAt" : { "$gte": start }}).countDocuments();//afiicher touts les information des users sauf password
        const eventpro = await EvenementProModel.find({ "createdAt" : { "$gte": start }}).countDocuments();//afiicher touts les information des users sauf password
        const allevent=eventpro+eventprive;
        res.status(200).json({result:allevent});

    }catch (err){
        return res.status(500).json({message: err});
    }


}
module.exports.getCountEventPArTrimestre= async (req,res) =>{
    try {
        // var todayDate = new Date().toISOString().slice(0, 10);
        var start = moment().subtract(3, 'months').toDate();
        //console.log(start)
        const eventprive = await EvenementPriveModel.find({ "createdAt" : { "$gte": start }}).countDocuments();//afiicher touts les information des users sauf password
        const eventpro = await EvenementProModel.find({ "createdAt" : { "$gte": start }}).countDocuments();//afiicher touts les information des users sauf password
        const allevent=eventpro+eventprive;
        res.status(200).json({result:allevent});

    }catch (err){
        return res.status(500).json({message: err});
    }


}
module.exports.getCountEventPArYears= async (req,res) =>{
    try {
        // var todayDate = new Date().toISOString().slice(0, 10);
        var start = moment().subtract(1, 'years').toDate();
        //console.log(start)
        const eventprive = await EvenementPriveModel.find({ "createdAt" : { "$gte": start }}).countDocuments();//afiicher touts les information des users sauf password
        const eventpro = await EvenementProModel.find({ "createdAt" : { "$gte": start }}).countDocuments();//afiicher touts les information des users sauf password
        const allevent=eventpro+eventprive;
        res.status(200).json({result:allevent});

    }catch (err){
        return res.status(500).json({message: err});
    }

}
