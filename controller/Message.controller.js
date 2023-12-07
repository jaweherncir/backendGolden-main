const MessageModel=require("../models/Message.model");
const fs = require("fs");
const moment = require("moment/moment");
const userModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
module.exports.newMessage=async (req,res)=>{

    if (!req.file) {
        // File does not exist.
        console.log("No file");
        const newMessage=new MessageModel({
            conversationId:req.body.conversationId,
            sender:req.body.sender,
            message:{
                messages: req.body.messages,
                image:null
            },

        });
        try{
            const savedMessage=await newMessage.save();
            res.status(200).json(savedMessage);

        }
        catch (err)
        {
            return res.status(500).json({message: err});

        }
    } else {
        // File exists.
        console.log("File exists");
        const newMessage=new MessageModel({
            conversationId:req.body.conversationId,
            sender:req.body.sender,
            message:{
                messages: null,
                image:{
                    data:fs.readFileSync("client/public/uploads/chatMessage/"+req.file.filename),
                    contentType:"image/jpg",
                    timestamp:new Date().getTime()

                }
            },

        });
        try{
            const savedMessage=await newMessage.save();
            res.status(200).json(savedMessage);

        }
        catch (err)
        {
            return res.status(500).json({message: err});

        }
    }


}
module.exports.allMessageConversation=async (req,res)=>{
    try{
        const messages=await MessageModel.find(
            {conversationId: req.params.conversationId}).
            populate({path:'conversationId',select:['members']}).
            populate({path:'sender', select:['nom','prenom','photo','_id']})
        res.status(200).json(messages);
    }
    catch (err)
    {
        return res.status(500).json({message: err});

    }
}
module.exports.allMessageByuserID=async (req,res)=>{
    try{
        const messages=await MessageModel.find(
            {sender: req.params.id}).
        populate({path:'conversationId',select:['members']}).
        populate({path:'sender', select:['nom','prenom','photo','_id']});
        res.status(200).json(messages);
    }
    catch (err)
    {
        return res.status(500).json({message: err});

    }
}
module.exports.deleteMessage=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await MessageModel.remove({_id:req.params.id})
        res.status(200).json({message: "succes deleted message"});

    }catch (err)
    {
        return res.status(500).json({message: err});

    }
}
module.exports.allImageMessage=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try{
        const messages=await MessageModel.findById(req.params.id,(err,data)=>{
            if(!err){
                return  res.send(data.message);
            } else
                return  res.status(400).send(err)
        }).select("message.image")

        res.status(200).json(messages);
    }
    catch (err)
    {
        return res.status(500);

    }
}
module.exports.getCountMessagePArJour= async (req,res) =>{
    try {
        // var todayDate = new Date().toISOString().slice(0, 10);
        var start = moment().subtract(24, 'hours').toDate();
        //console.log(start)


        await MessageModel.find({
                "createdAt" : { "$gte": start }},
            (err,countuser)=>{
                if( err)
                    res.status(401).json({err})
                else
                    return res.status(200).json({result:countuser.length});

            });

    }catch (err){
        return res.status(500).json({message: err});
    }


}
module.exports.getCountMessagePArSemaine= async (req,res) =>{
    try {
        // var todayDate = new Date().toISOString().slice(0, 10);
        var start = moment().subtract(7, 'days').toDate();
        console.log(start)


        await MessageModel.find({
                "createdAt" : { "$gte": start }},
            (err,countuser)=>{
                if( err)
                    res.status(401).json({err})
                else
                    return res.status(200).json({result:countuser.length});

            });

    }catch (err){
        return res.status(500).json({message: err});
    }


}
module.exports.getCountMessageParMois= async (req,res) =>{
    try {
        // var todayDate = new Date().toISOString().slice(0, 10);
        var start = moment().subtract(1, 'months').toDate();
        console.log(start)


        await MessageModel.find({
                "createdAt" : { "$gte": start }},
            (err,countuser)=>{
                if( err)
                    res.status(401).json({err})
                else
                    return res.status(200).json({result:countuser.length});

            });

    }catch (err){
        return res.status(500).json({message: err});
    }


}
module.exports.getCountMessageParTrimestre= async (req,res) =>{
    try {
        // var todayDate = new Date().toISOString().slice(0, 10);
        var start = moment().subtract(3, 'months').toDate();
        console.log(start)


        await MessageModel.find({
                "createdAt" : { "$gte": start }},
            (err,countuser)=>{
                if( err)
                    res.status(401).json({err})
                else
                    return res.status(200).json({result:countuser.length});

            });

    }catch (err){
        return res.status(500).json({message: err});
    }


}
module.exports.getCountMessageParYears= async (req,res) =>{
    try {
        // var todayDate = new Date().toISOString().slice(0, 10);
        var start = moment().subtract(1, 'years').toDate();
        console.log(start)


        await MessageModel.find({
                "createdAt" : { "$gte": start }},
            (err,countuser)=>{
                if( err)
                    res.status(401).json({err})
                else
                    return res.status(200).json({result:countuser.length});

            });

    }catch (err){
        return res.status(500).json({message: err});
    }


}