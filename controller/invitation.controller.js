const InvitationMedel= require("../models/invitation.model");
const NotificationModel=require("../models/notifications.model");
//const res = require("express/lib/response");

const ObjectId = require("mongoose").Types.ObjectId;

//invitation jumlage 
module.exports.invitationJumlage=  (req,res) =>{
    if(!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.id))
        return res.status(400).send("ID UNKNow"+req.params.id);
    try {
         InvitationMedel.findOneAndUpdate(
            {userID:req.params.id},
            {
                $push:{
                    senderReqJumlage: {
                        _id:req.body.id,
                        timestamp:new Date().getTime()
                    },
                }
            },
            {new: true, upsert:false},
            (err,data) =>{
                if(!err)
                {
                   return  res.status(201).json(data);
                  //  console.log(data);
                }
                else
                    return res.status(400).json(err);
            }
        );
         InvitationMedel.findOneAndUpdate(
            {"userID":req.body.id},
            {
                $push:{
                    reciverReqJumlage: {
                        _id:req.params.id,
                        timestamp:new Date().getTime()
                    },
                }
            },
            {new: true, upsert:false},
            (err,data) =>{
                if(err)
                    return res.status(400).json(err);
                else
                {
                    NotificationModel.findOneAndUpdate(
                        {"userID":req.body.id},
                        {
                            $addToSet:{
                                jumlagereciver:{
                                    usersenderid:req.params.id,
                                    timestamp:new Date().getTime()
                                }
                            }
                        },
                        {new:true, upsert:false},
                        (errr,dataa)=>{}
                    );
                }
            }
        );
    }catch (err){
        return res.status(400).send(err);
    }

}
//acceptation jumlage et creation compte duo
exports.jumlage_createUser = async (req,res) =>{
    
}
module.exports.refuseDemandeJumlage= async (req,res,next) =>{
    //res.status(200).send({message:"bien"});
    if(!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.usersender))
        return res.status(400).send("ID UNKNow"+req.params.id);
    try {
        await NotificationModel.findOneAndUpdate({
            "userID":req.params.id
        },{
            $pull:{jumlagereciver:{usersenderid:req.body.usersender}}
        },{
            new: true, upsert: true
        }),
      await InvitationMedel.findOneAndUpdate({
       "userID":req.params.id
      },{
          $pull:{reciverReqJumlage:{_id:req.body.usersender}}
      },{
          new: true, upsert: true
      }),
          await InvitationMedel.findOneAndUpdate({
              "userID":req.body.usersender
          },{
              $pull:{senderReqJumlage:{_id:req.params.id}}
          },{
              new: true, upsert: true
          },(err,reponse)=>{
              if (err)
                  res.status(500).send({message:err})
              else
                  return  res.status(200).send(reponse)

          });
    }catch (err){
        return res.status(400).send(err);
    }


}
module.exports.AnnulerDemandeJumlage= async (req,res,next) =>{
    //res.status(200).send({message:"bien"});
    if(!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.userreciver))
        return res.status(400).send("ID UNKNow"+req.params.id);
    try {
        await NotificationModel.findOneAndUpdate({
            "userID":req.body.userreciver
        },{
            $pull:{jumlagereciver:{usersenderid:req.params.id}}
        },{
            new: true, upsert: true
        }),
            await InvitationMedel.findOneAndUpdate({
                "userID":req.body.userreciver
            },{
                $pull:{reciverReqJumlage:{_id:req.params.id}}
            },{
                new: true, upsert: true
            }),
            await InvitationMedel.findOneAndUpdate({
                "userID":req.params.id
            },{
                $pull:{senderReqJumlage:{_id:req.body.userreciver}}
            },{
                new: true, upsert: true
            },(err,reponse)=>{
                if (err)
                    res.status(500).send({message:err})
                else
                    return  res.status(200).send(reponse)

            });
    }catch (err){
        return res.status(400).send(err);
    }


}

module.exports.invitationCoupCoueur=  (req,res) =>{
    if(!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.id))
        return res.status(400).send("ID UNKNow"+req.params.id);
    try {
        InvitationMedel.findOneAndUpdate(
            {userID:req.params.id},
            {
                $push:{
                    senderReqCoupCoeur: {
                        _id:req.body.id,
                        timestamp:new Date().getTime()

                    },
                }
            },
            {new: true, upsert:false},
            (err,data) =>{
                if(!err)
                {
                    return  res.status(201).json(data);
                    //  console.log(data);

                }

                else
                    return res.status(400).json(err);
            }

        );
        InvitationMedel.findOneAndUpdate(
            {"userID":req.body.id},
            {
                $push:{
                    reciverCoupCoeur: {
                        _id:req.params.id,
                        timestamp:new Date().getTime()

                    },

                }
            },
            {new: true, upsert:false},
            (err,data) =>{
                if(err)
                    return res.status(400).json(err);


            }

        );


    }catch (err){
        return res.status(400).send(err);
    }

}
//Developement Contact
module.exports.InvitationContact=  async (req,res) =>{
    if(!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.id))
        return res.status(400).send("ID UNKNow"+req.params.id);
    try {
     let userdender=   await InvitationMedel.findOneAndUpdate(
            {userID:req.params.id},
            {
                $push:{
                    senderReqFreinds: {
                        _id:req.body.id,
                        timestamp:new Date().getTime()
                    },
                }
            },
            {new: true, upsert:false}
        );
      await  InvitationMedel.findOneAndUpdate(
            {"userID":req.body.id},
            {
                $push:{
                    reciverReqFreinds: {
                        _id:req.params.id,
                        timestamp:new Date().getTime()
                    },
                }
            },
            {new: true, upsert:false}

        ),
          await NotificationModel.findOneAndUpdate(
              {"userID":req.body.id},
              {
                  $addToSet:{
                      Interaction:{
                          usersenderid:req.params.id,
                          timestamp:new Date().getTime(),
                          model:"contact",
                          text:"souhaite vous ajouter à ses contacts"
                      }
                  }
              },
              {new:true, upsert:false},
              (errr,dataa)=>{
                  if (!errr)

                      return res.status(200).send({invitation:userdender,notif:dataa.Interaction[dataa.Interaction.length -1]});


              }
          );
    }catch (err){
        return res.status(400).send(err);
    }

}
module.exports.AnnulerInvitationContact= async (req,res,next) =>{
    //res.status(200).send({message:"bien"});
    if(!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.userreciver))
        return res.status(400).send("ID UNKNow"+req.params.id);
    try {
    /*    await NotificationModel.findOneAndUpdate({
            "userID":req.body.userreciver
        },{
            $pull:{Interaction:{_id:req.body.idnotif}}
        },{
            new: true, upsert: true
        }),*/
            await InvitationMedel.findOneAndUpdate({
                "userID":req.body.userreciver
            },{
                $pull:{reciverReqFreinds:{_id:req.params.id}}
            },{
                new: true, upsert: true
            }),
            await InvitationMedel.findOneAndUpdate({
                "userID":req.params.id
            },{
                $pull:{senderReqFreinds:{_id:req.body.userreciver}}
            },{
                new: true, upsert: true
            },(err,reponse)=>{
                if (err)
                    res.status(500).send({message:err})
                else
                    return  res.status(200).send(reponse)

            });
    }catch (err){
        return res.status(400).send(err);
    }


}
module.exports.RefuseInvitationContact= async (req,res,next) =>{
    //res.status(200).send({message:"bien"});
    if(!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.usersender))
        return res.status(400).send("ID UNKNow"+req.params.id);
    try {
        /*await NotificationModel.findOneAndUpdate({
            "userID":req.params.id
        },{
            $pull:{Interaction:{_id:req.body.idnotif}}
        },{
            new: true, upsert: true
        }),*/
            await InvitationMedel.findOneAndUpdate({
                "userID":req.params.id
            },{
                $pull:{reciverReqFreinds:{_id:req.body.usersender}}
            },{
                new: true, upsert: true
            }),
            await InvitationMedel.findOneAndUpdate({
                "userID":req.body.usersender
            },{
                $pull:{senderReqFreinds:{_id:req.params.id}}
            },{
                new: true, upsert: true
            },(err,reponse)=>{
                if (err)
                    res.status(500).send({message:err})
                else
                    return  res.status(200).send(reponse)

            });
    }catch (err){
        return res.status(400).send(err);
    }


}
module.exports.InvitationAlbum=  async  (req,res) =>{
    if(!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.id))
        return res.status(400).send("ID UNKNow"+req.params.id);
    try {
       await InvitationMedel.findOneAndUpdate(
            {userID:req.params.id},
            {
                $addToSet:{
                    senderAccesAlbum: {
                        _id:req.body.id,
                        timestamp:new Date().getTime(),
                        duree:req.body.duree
                    },
                }
            },
            {new: true, upsert:false},
            (err,data) =>{
                if(!err)
                {
                    return  res.status(201).json(data);
                    //  console.log(data);
                }
                else
                    return res.status(400).json(err);
            }
        ),
        await InvitationMedel.findOneAndUpdate(
            {"userID":req.body.id},
            {
                $addToSet:{
                    reciverAccesAlbum: {
                        _id:req.params.id,
                        timestamp:new Date().getTime(),
                        duree:req.body.duree
                    },
                }
            },
            {new: true, upsert:false}
        ),
          await NotificationModel.findOneAndUpdate(
               {"userID":req.body.id},
               {
                   $addToSet:{
                       reciverAccesAlbum:{
                           usersenderid:req.params.id,
                           timestamp:new Date().getTime(),
                           duree:req.body.duree
                       }
                   }
               },
               {new:true, upsert:false},
           );
    }catch (err){
        return res.status(400).send(err);
    }

}

