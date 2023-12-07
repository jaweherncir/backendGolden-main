const AlbumModel= require("../models/album.model");
const fs = require("fs");
const moment = require("moment");
const UserModel = require("../models/user.model");
const EvenementProModel = require("../models/evenementpro");
const NotificationModel = require("../models/notifications.model");
const InvitationMedel = require("../models/invitation.model");
const userModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
module.exports.getAllAlbumByID=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);
    AlbumModel.findById(req.params.id, (err, albumdata) => {
        if (!err) res.send(albumdata);
        else console.log("ID unknown : " + err);
    })
}
module.exports.getAlbumProfileByUSerID=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);
    AlbumModel.find({userId:req.params.id}, (err, albumdata) => {
        if (!err) res.send(albumdata[0].photosprofile);
        else console.log("ID unknown : " + err);
    }).select("photosprofile")
}
module.exports.getAlbumCouvertureByUSerID=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);
    AlbumModel.find({userId:req.params.id}, (err, albumdata) => {
        if (!err) res.send(albumdata[0].photoscouvertir);
        else console.log("ID unknown : " + err);
    }).select("photoscouvertir")
}
module.exports.getPhotoProfileFromAlbumByUserId=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id) && !ObjectID.isValid(req.params.iduser) )
        return res.status(400).send("ID unknown : " + req.params.id);
   await  AlbumModel.find(
       {
           userId:req.params.iduser
       },
       {
           _id:0,
           photosprofile:{$elemMatch:{_id:req.params.id}}
       },{

       },(err,profilephoto)=>{
           if (err) return  res.status(500).send({message: err});
           if(!err) return res.status(201).send(profilephoto[0].photosprofile[0])
       }
   )

}
module.exports.getPhotoCouvertirFromAlbumByUserId=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id) && !ObjectID.isValid(req.params.iduser) )
        return res.status(400).send("ID unknown : " + req.params.id);
    await  AlbumModel.find(
        {
            userId:req.params.iduser
        },
        {
            _id:0,
            photoscouvertir:{$elemMatch:{_id:req.params.id}}
        },{

        },(err,couvertirphoto)=>{
            if (err) return  res.status(500).send({message: err});
            if(!err) return res.status(201).send(couvertirphoto[0].photoscouvertir[0])
        }
    )

}
module.exports.AddPhotoAlbum= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    let albumModel;
    try {
        albumModel = new AlbumModel({
            userId: req.params.id,
            picture: {
                data: fs.readFileSync("client/public/uploads/album/" + req.file.filename),
                contentType: "image/jpg",
                timestamp: new Date().getTime()
            }
        });
         await albumModel.save((err,reponse)=>{
             if (reponse)
                 return res.status(201).send(reponse)
             else
                 return res.status(401).send(err)

         });
    } catch (err) {

        return res.status(500).json({message: err});
    }

}
module.exports.PrivialiserPhotoFromALbum= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await AlbumModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    visible: false,

                }
            },
            {new: true, upsert: true, setDefaultsOnInsert:true},
            (err,data) =>{
                if (!err) return res.status(200).send(data);
                if (err) return  res.status(500).send({message: err});
            }
        )
    }catch(err) {

        return res.status(500).json({message: err});
    }

}
module.exports.DeletePhotoFromAlbum = async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("Id unknow : "+req.params.id);
    try {
        await AlbumModel.findByIdAndRemove(
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
module.exports.accepAccesAlbum=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.usersender)  )
        return res.status(400).send('ID unknown '+req.params.id);
    const durre=req.body.duree;
    var start;
    try {
        //console.log(durre)

       // console.log(new Date('0000-01-01'))

        switch (durre) {
            case 32:
                start = moment().subtract(-32, 'hours').toDate();
                break
            case 24:
                start = moment().subtract(-24, 'hours').toDate();
                break
            case 0:
                start = new Date('0000-01-01')
                break
            default:
                res.status(401).send({error:"duree not found !"})
        }
        await UserModel.findByIdAndUpdate({_id:req.params.id},{
                $addToSet:{
                    albumacces:{
                        _id:req.body.usersender,
                        timestamp:new Date().getTime(),
                        duree:start
                    }
                }
            },
            {new:true, upsert:false},(err,reponse)=>{
                if (err)
                    return res.status(400).json(err);
                else
                    return res.status(201).json(reponse);

            }

        );


       /* // add to the follower liste
        await NotificationModel.findOneAndUpdate({
            "userID":req.params.id
        },{
            $pull:{friendsreciver:{usersenderid:req.body.usersender}}
        },{
            new: true, upsert: true
        }),
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
            }),
            //add to following liste
            // 9owet el request patch est non put
            await userModel.findByIdAndUpdate(
                {_id: req.body.usersender},
                {$addToSet : {friends : req.params.id}},
                {new: true, upsert:true}

            ),
            await userModel.findByIdAndUpdate(
                {_id: req.params.id},//id d personne qui faire labonne
                {
                    $addToSet : {friends: req.body.usersender}
                },
                {new: true, upsert:true},
                (err,data) =>{
                    if (err)
                        return res.status(400).json(err);
                    else
                        return res.status(201).json(data);
                });
*/
    }catch (err){
        return res.status(500).json({message: err});

    }

}




