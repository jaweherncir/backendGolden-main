const conversationModel=require('../models/Conversation.model')

const ObjectID = require("mongoose").Types.ObjectId;
//creat new conversation
module.exports.newConversation=async (req,res)=>{
    const  newconversation=new conversationModel({members: [req.body.senderId,req.body.receiverId]});
    try
    {
        const savedConversation=await newconversation.save();
        res.status(200).json(savedConversation)
    }catch (err) {
        res.status(500).json(err);
    }

}
//get one converstaion of user
module.exports.oneConversation=async (req,res)=>{
    try{
        const conversation=await conversationModel.find(
            {
                members:{$in:[req.params.userId]},
            });
        res.status(200).json(conversation);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
//delete conversation
module.exports.deletConversation=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await conversationModel.remove({_id:req.params.id})
        res.status(200).json({message: "succes deleted conversation"});

    }catch (err)
    {
        return res.status(500).json({message: err});

    }
}
/*
module.exports.deletAllMessageConversation=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown '+req.params.id);
    try {
   await MessageModel.findByIdAndUpdate(
       req.body.id,
       {
           $pull:{
               message:{
                   messages: req.body.messages
               }
           }
       },{new:true,upsert:true},
       (err,data)=>{
           if(!err)res.status(200).send(data)
           else res.status(400).send(err)
       }

   )
   await conversationModel .findByIdAndUpdate(
       req.params.id,
       {$pull:{

                    }},
       {new:true,upsert:true},
       (err,data)=>
       {
           if(!err)res.status(200).send(data)
           else res.status(400).send(err)
       }

   )

         }catch (err)
    {
        return res.status(500).json({message: err});

    }
}*/
