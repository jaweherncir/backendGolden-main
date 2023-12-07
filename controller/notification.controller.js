const NotificationModel = require("../models/notifications.model");
const ObjectID = require("mongoose").Types.ObjectId;
module.exports.GetNotificationContactByUSer= async (req,res,next) =>{
    //res.status(200).send({message:"bien"});
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID UNKNow"+req.params.id);
    try {
        await NotificationModel.find({
            "userID":req.params.id
        },(err,reponse)=>{
            if (!err){
                let tab = reponse[0].Interaction
                let nonvu=0;
                for(let i=0; i<tab.length;i++){
                    if (tab[i].vunotif==false)
                        nonvu++
                }

                return res.status(201).json({nonvues:nonvu,notifications:reponse[0].Interaction})
            }
            else
                return res.status(401).json({err})

        }).select('Interaction userID').sort({'Interaction.timestamp':-1})
            .populate({path:'Interaction.usersenderid',select:['pseudo','photo']});
    }catch (err){
        return res.status(400).send(err);
    }


}
module.exports.GetNotificationQueuretByUSer= async (req,res,next) =>{
    //res.status(200).send({message:"bien"});
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID UNKNow"+req.params.id);
    try {
        await NotificationModel.find({
            "userID":req.params.id
        },(err,reponse)=>{
            if (!err){
                let tab = reponse[0].Coeur
                let nonvu=0;
                for(let i=0; i<tab.length;i++){
                    if (tab[i].vunotif==false)
                        nonvu++
                }

                return res.status(201).json({nonvues:nonvu,notifications:reponse[0].Coeur})
            }
            else
                return res.status(401).json({err})

        }).select('Coeur userID').sort({'Coeur.timestamp':-1})
            .populate({path:'Coeur.usersenderid',select:['pseudo','photo']});
    }catch (err){
        return res.status(400).send(err);
    }


}
module.exports.GetNotificationEventByUSer= async (req,res,next) =>{
    //res.status(200).send({message:"bien"});
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID UNKNow"+req.params.id);
    try {
        await NotificationModel.find({
            "userID":req.params.id
        },(err,reponse)=>{
            if (!err){
                let tab = reponse[0].Evenement
                let nonvu=0;
                for(let i=0; i<tab.length;i++){
                    if (tab[i].vunotif==false)
                        nonvu++
                }

                return res.status(201).json({nonvues:nonvu,notifications:reponse[0].Evenement})
            }
            else
                return res.status(401).json({err})

        }).select('Evenement userID').sort({'Evenement.timestamp':-1})
            .populate({path:'Evenement.usersenderid',select:['pseudo','photo']});
    }catch (err){
        return res.status(400).send(err);
    }


}
module.exports.GetNotificationMessagetByUSer= async (req,res,next) =>{
    //res.status(200).send({message:"bien"});
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID UNKNow"+req.params.id);
    try {
        await NotificationModel.find({
            "userID":req.params.id
        },(err,reponse)=>{
            if (!err){
                let tab = reponse[0].Message
                let nonvu=0;
                for(let i=0; i<tab.length;i++){
                    if (tab[i].vunotif==false)
                        nonvu++
                }

                return res.status(201).json({nonvues:nonvu,notifications:reponse[0].Message})
            }
            else
                return res.status(401).json({err})

        }).select('Message userID').sort({'Message.timestamp':-1})
            .populate({path:'Message.usersenderid',select:['pseudo','photo']});
    }catch (err){
        return res.status(400).send(err);
    }



}

module.exports.GetNotificationIneratctiontByUSerandidnotif= async (req,res,next) =>{
    //res.status(200).send({message:"bien"});
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.params.idnotif) )
        return res.status(400).send("ID UNKNow"+req.params.id);
    try {
        await NotificationModel.find({
            "userID":req.params.id
        },{
            _id:0,
            Interaction:{$elemMatch:{_id:req.params.idnotif}}
        },(err,reponse)=>{
            if (!err)
                return res.status(201).json(reponse[0].Interaction[0])
            else
                return res.status(401).json({err})

        })
            .populate({path:'Interaction.usersenderid',select:['pseudo','photo']});
    }catch (err){
        return res.status(400).send(err);
    }



}
module.exports.GetNotificationCoueurByUSerandidnotif= async (req,res,next) =>{
    //res.status(200).send({message:"bien"});
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.params.idnotif) )
        return res.status(400).send("ID UNKNow"+req.params.id);
    try {
        await NotificationModel.find({
            "userID":req.params.id
        },{
            _id:0,
            Coeur:{$elemMatch:{_id:req.params.idnotif}}
        },(err,reponse)=>{
            if (!err)
                return res.status(201).json(reponse[0].Coeur[0])
            else
                return res.status(401).json({err})

        }).populate({path:'Coeur.usersenderid',select:['pseudo','photo']});
    }catch (err){
        return res.status(400).send(err);
    }



}
module.exports.GetNotificationMessageByUSerandidnotif= async (req,res,next) =>{
    //res.status(200).send({message:"bien"});
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.params.idnotif) )
        return res.status(400).send("ID UNKNow"+req.params.id);
    try {
        await NotificationModel.find({
            "userID":req.params.id
        },{
            _id:0,
            Message:{$elemMatch:{_id:req.params.idnotif}}
        },(err,reponse)=>{
            if (!err)
                return res.status(201).json(reponse[0].Message[0])
            else
                return res.status(401).json({err})

        }).populate({path:'Message.usersenderid',select:['pseudo','photo']});
    }catch (err){
        return res.status(400).send(err);
    }



}
module.exports.GetNotificationEventByUSerandidnotif= async (req,res,next) =>{
    //res.status(200).send({message:"bien"});
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.params.idnotif) )
        return res.status(400).send("ID UNKNow"+req.params.id);
    try {
        await NotificationModel.find({
            "userID":req.params.id
        },{
            _id:0,
            Evenement:{$elemMatch:{_id:req.params.idnotif}}
        },(err,reponse)=>{
            if (!err)
                return res.status(201).json(reponse[0].Evenement[0])
            else
                return res.status(401).json({err})

        }).populate({path:'Evenement.usersenderid',select:['pseudo','photo']});
    }catch (err){
        return res.status(400).send(err);
    }



}