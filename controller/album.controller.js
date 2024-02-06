const AlbumModel= require("../models/album.model");
const fs = require("fs");  
const moment = require("moment");
const UserModel = require("../models/user.model");
const EvenementProModel = require("../models/evenementpro");
const NotificationModel = require("../models/notifications.model");
const InvitationMedel = require("../models/invitation.model");
const userModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const cloudinary = require('cloudinary').v2;
const  multer = require("multer");

cloudinary.config({
    cloud_name: "dm0c8st6k",
    api_key: "541481188898557",
    api_secret: "6ViefK1wxoJP50p8j2pQ7IykIYY"
  }); 
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "client/public/uploads/album");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});



const upload = multer({ storage: storage }); 
module.exports.getAllAlbumByIDUser=async (req,res)=>{
    try {
        const userId = req.params.userId;

        // Find the album by userId
        const album = await AlbumModel.findOne({ userId });

        if (!album) {
            return res.status(404).json({ error: 'Album not found for the given userId.' });
        }

        return res.status(200).json({ album });
    } catch (err) {
        console.error('Error retrieving album:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports.AddPhotoAlbum = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid album ID: ' + req.params.id });
    }

    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: `users/${req.params.id}/album`,
        });

   

        // Update the user's album with the photo URL
        const updatedAlbum = await AlbumModel.findOneAndUpdate(
            { userId: req.params.id },
            { $push: { photos: { url: result.secure_url, visible: true } } },
            { new: true, upsert: true }
        );

        return res.status(200).json({ album: updatedAlbum });
    } catch (err) {
        console.error('Error adding  photo:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }















   
};
module.exports.DeletePhotoFromAlbum = async (req, res) => {
    try {
        const photoId = req.params.id;
    
        // Find the album containing the photo
        const album = await AlbumModel.findOne({ "photos._id": photoId });
    
        if (!album) {
          return res.status(404).json({ message: 'Photo not found in album' });
        }
    
        // Remove the photo from the photos array
        album.photos = album.photos.filter(photo => photo._id.toString() !== photoId);
    
        // Save the updated album
        await album.save();
    
        res.status(200).json({ message: 'Photo deleted successfully' });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server Error' });
      }
};
//get all image privée of album 
module.exports.getPrivateImage=async(req,res)=>{
    try {
        const userId = req.params.userId;
    
        // Find the album for the specified userId
        const album = await AlbumModel.findOne({ userId });
    
        if (!album) {
          return res.status(404).json({ message: 'Album not found for the specified user' });
        }
    
        // Extract visible photos from the album
        const visiblePhotos = album.photos.filter(photo => photo.visible);
    
        res.status(200).json(visiblePhotos);
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server Error' });
      }
}
//get all image public of album
module.exports.getPublicImage = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Find the album for the specified userId
      const album = await AlbumModel.findOne({ userId });
  
      if (!album) {
        return res.status(404).json({ message: 'Album not found for the specified user' });
      }
  
      // Extract photos with visibility set to false from the album
      const invisiblePhotos = album.photos.filter(photo => !photo.visible);
  
      res.status(200).json(invisiblePhotos);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server Error' });
    }
  };
module.exports.change = async (req, res) => {
    const { albumId, photoId } = req.params;
    const { visible } = req.body;
  
    try {
      const album = await AlbumModel.findById(albumId);
  
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }
  
      const photoIndex = album.photos.findIndex((photo) =>
        photo._id.equals(photoId)
      );
  
      if (photoIndex === -1) {
        return res.status(404).json({ message: "Photo not found in the album" });
      }
  
      album.photos[photoIndex].visible = visible;
      await album.save();
  
      res.json({ message: "Visibility changed successfully", album });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
module.exports.changeVisibiltyAlbum = async (req, res) => {
    const { albumId } = req.params;
    const { visible } = req.body;
  
    try {
      const album = await AlbumModel.findById(albumId);
  
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }
  
      album.visible = visible;
      await album.save();
  
      res.json({ message: "Album visibility changed successfully", album });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };



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
 



