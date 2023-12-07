const UserModel = require('../models/user.model');
const InvitationModel=require("../models/invitation.model");
const NotificationsModel = require("../models/notifications.model");
const AlbumModel=require("../models/album.model");
const jwt = require("jsonwebtoken");
const ObjectID = require("mongoose").Types.ObjectId;
const {singUpErrors,singInErrors}=require('../utils/errors.utils');

const maxAge=3*24*60*60*1000;
const _ = require("lodash");
const bcrypt = require("bcrypt");

const RencontreModel= require("../models/Rencontre.model");
const nodemailer = require("nodemailer");
const fs = require("fs")
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "dm0c8st6k",
    api_key: "541481188898557",
    api_secret: "6ViefK1wxoJP50p8j2pQ7IykIYY"
  }); 
const createToken = (id) =>{
    return jwt.sign({id},process.env.TOKEN_SECRET,{
        expiresIn: maxAge
    })
}


/*
module.exports.signUp= async (req,res) =>{
    const  {
        pseudo,email,password,nomfamille,prenom,nom,datenass,pays,
        ville,numero,langueCourant,langueSecondaire,
        profession,silhoutte,orgineethnique,nature,orientationsexe,preferences,
        valeurscroyances,typerelation,votrecaractere,temperament,interet,
    }=req.body
    const photo=req.files.photo[0].filename
    const couvertir=req.files.couvertir[0].filename

    try {
        const user = await  UserModel.create({pseudo,email,password,nomfamille,prenom,nom,
            datenass,pays,ville,numero,langueCourant,langueSecondaire,
            profession,silhoutte,orgineethnique,nature,orientationsexe,preferences,
            valeurscroyances,typerelation,votrecaractere,temperament,interet,photo,couvertir
        });

        if (user)
        {
            const newInvitModel = new InvitationModel(
                {
                    userID:user._id
                }
            );
            const newNotificationsModel= new NotificationsModel(
                {
                    userID:user._id
                }

            );
            await newInvitModel.save();
            await newNotificationsModel.save();
            res.status(201).json({user: user._id});

        }


    }
    catch (err){
        const errors = singUpErrors(err);
        res.status(200).send({errors});

       // console.log(err);
    }

}
*/
module.exports.signUp= async (req,res) =>{
    const  {
        pseudo,nom,prenom,dateNass
    }=req.body

    try {
        const user = await  UserModel.create({pseudo,nom,prenom,dateNass

        });

        if (user)
        {
            const newInvitModel = new InvitationModel(
                {
                    userID:user._id
                }
            );
            const newNotificationsModel= new NotificationsModel(
                {
                    userID:user._id
                }

            );
            const newRencontreModel = new RencontreModel({
                userID:user._id
            });
            await newInvitModel.save();
            await newNotificationsModel.save();
            await newRencontreModel.save();
            res.status(201).send(user);

        }
    }
    catch (err){
        const errors = singUpErrors(err);
        res.status(401).send({errors});

        // console.log(err);
    }

}
//update etape1 
module.exports.updateEtape1= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        const  salt = await bcrypt.genSalt();
        const email= req.body.email;
        const emailverif= await UserModel.findOne({email})
       // req.bodypassword = await bcrypt.hash(this.password,salt);
        if(emailverif){
            res.status(300).json({errors:"email deja exist"})
        }
        else {


            await UserModel.findByIdAndUpdate(
                {_id: req.params.id},
                {
                    $set: {
                        email: req.body.email,
                        numero: req.body.numero,
                        password: await bcrypt.hash(req.body.password, salt)
                    }
                },
                {new: true, upsert: true, setDefaultsOnInsert: true},
                (err, data) => {
                    if (!err) return res.send(data);
                    if (err) return res.status(500).send({message: err});
                }
            )
        }
    }catch(err) {

        return res.status(500).json({message: err});
    }


} 
//update code parinage 
module.exports.updateCodeParinage= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    codeParinage: req.body.codeParinage,

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
//updaet to add photo profil  
//avec algorithme de prohibé 
 function GetIDPhotoFromAlbum(list){
    var last = [].slice.call(list).pop()._id;
    return last


}
/*
module.exports.updatePhotoProfil= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        AlbumModel.findOneAndUpdate(
            {"userId":req.params.id},
            {
                $push: {
                    photosprofile: {
                        //data:Buffer.from(req.file.filename,"base64"),
                        data:fs.readFileSync("client/"+req.file.filename),
                        contentType:"image/jpg",
                        timestamp:new Date().getTime()
                    }

                }
            },
            {new: true, upsert: true, setDefaultsOnInsert:true},
            (err,data) =>{
                console.log(data._id)
                if (!err) {
                   // return res.send(data);
                    console.log( GetIDPhotoFromAlbum(data.photosprofile))
                     UserModel.findByIdAndUpdate(
                         {_id:req.params.id},
                         {$set:{
                                 photo:GetIDPhotoFromAlbum(data.photosprofile)
                             }
                         },
                         {new:true, upsert:true},
                         (errr,data)=>{
                             if(!errr)  res.send(data);
                             else res.send(errr)

                         }
                     );
                }
                if (err) return  res.status(500).send({message: err});
            }
        )
    }catch(err) {

        return res.status(500).json({message: err});
    }

}
*/
module.exports.updatePhotoProfil= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        albumModel= new AlbumModel({
            userId: req.params.id,
            picture:{
                data:fs.readFileSync("client/public/uploads/album/"+req.file.filename),
                contentType:"image/jpg",
                timestamp:new Date().getTime()
            }
        });
        const addphotoprofile= await albumModel.save();
        if (addphotoprofile){
           await UserModel.findByIdAndUpdate(
                {_id:req.params.id},
                {$set:{
                        photo:addphotoprofile._id
                    }
                },
                {new:true, upsert:true},
                (errr,data)=>{
                    if(!errr)  res.status(201).send(data);
                    else res.status(401).send(errr)

                }
            );

        }
    }catch(err) {

        return res.status(500).json({message: err});
    }

}

module.exports.updatePhotoCouvertir= async (req,res) =>{
 if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).send('ID unknown: ' + req.params.id);
    }
  
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `Golden/users/profile_photos/${req.params.id}`, // Store images in a folder based on user ID
      });
  
      await UserModel.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            photo: result.secure_url // Store the secure URL of the uploaded image
          }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
        (err, data) => {
          if (!err) return res.send(data);
          if (err) return res.status(500).send({ message: err });
        }
      );
    } catch (err) {
      return res.status(500).json({ message: err });
    }















    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        albumModel= new AlbumModel({
            userId: req.params.id,
            picture:{
                data:fs.readFileSync("client/public/uploads/album/"+req.file.filename),
                contentType:"image/jpg",
                timestamp:new Date().getTime()
            }
        });
        const addphotocouverture= await albumModel.save();
        if (addphotocouverture){
            await UserModel.findByIdAndUpdate(
                {_id:req.params.id},
                {$set:{
                        couvertir:addphotocouverture._id
                    }
                },
                {new:true, upsert:true},
                (errr,data)=>{
                    if(!errr)  res.status(201).send(data);
                    else res.status(401).send(errr)

                }
            );

        }
    }catch(err) {

        return res.status(500).json({message: err});
    }

}
//update add user
//add genre
module.exports.updateGenre= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    genre: req.body.genre,
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
//add orientationsexe
module.exports.orientationsexe= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    orientationsexe: req.body.orientationsexe,


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
//add langue
module.exports.langue= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    langue: req.body.langue,


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
//add orgine
module.exports.orgine= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    orgine: req.body.orgine,


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
module.exports.prfession= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    metier: req.body.metier,


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
//add metier
/*
module.exports.metier2= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    metier: req.body.metier,


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
*/
//add attirance
/*
module.exports.attirance= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    attirance: req.body.attirance,


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
*/
//add relationRechercher
module.exports.relationRechercher= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    relationRechercher: req.body.relationRechercher,


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
//add valeur
module.exports.valeur= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    valeur: req.body.valeur,


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
//add interet
module.exports.interet= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    interet: req.body.interet,


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
//add musique
module.exports.musique= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    musique: req.body.musique,


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
//add caractere
module.exports.caractere= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    caractere: req.body.caractere,


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
module.exports.personalite= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    personalite : req.body.personalite,


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
module.exports.sihloutte= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
       // console.log(req.body.sihloutte[0])
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    sihloutte: req.body.sihloutte,


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

module.exports.certificat= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
      }
    
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: `Golden/users/certification_photos/${req.params.id}`, // Store images in a folder based on user ID
        });
    
        await UserModel.findByIdAndUpdate(
          { _id: req.params.id },
          {
            $set: {
                certificat: result.secure_url // Store the secure URL of the uploaded image
            }
          },
          { new: true, upsert: true, setDefaultsOnInsert: true },
          (err, data) => {
            if (!err) return res.send(data);
            if (err) return res.status(500).send({ message: err });
          }
        );
      } catch (err) {
        return res.status(500).json({ message: err });
      }










    


}


module.exports.Etape1= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    etape1:{
                        pseudopro:req.body.etape1[0],
                        siteinternet:req.body.etape1[1],
                        instagramacount:req.body.etape1[2]
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
module.exports.Etape2= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    etape2: {
                        rep1:req.body.rep1,
                        rep2:req.body.rep2
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
module.exports.Etape3= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    etape3: {
                        rep1:req.body.rep1,
                        rep2:req.body.rep2
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
module.exports.Etape4= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    etape4: {
                        rep1:req.body.rep1,
                        rep2:req.body.rep2
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
module.exports.Etape5= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    etape5: {
                        rep1:req.body.rep1
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

module.exports.signIn=async (req,res) =>{
    const {email,password } = req.body
    try {
        const user = await UserModel.login(email,password); //verifier si cette utilisateur existe ou non dans la base de donee
        const token = createToken(user._id);

        //console.log(user);
       // console.log(token);
        res.cookie('jwt', token,{httpOnly: true, maxAge})  ;
        res.status(201).json(user);

    }catch (err){
        const errors =singInErrors(err)
        res.status(500).json({errors});

    }

}
module.exports.logOut=async (req,res) =>{
    res.cookie('jwt','',{maxAge:1}); //max age 1 mellisecound (supprimer le cookie)
    res.redirect('/');


}


exports.forgotPassword = async(req, res) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      const email = req.body.email;
      const user = await UserModel.findOne({ email: email });
      const lastname=user.name
    
      if (!user) {
        return res.status(404).json({ message: "email is not associated with an account" });
      }
    
      // Generate a new random password
      const newPassword = generateRandomPassword(); // Implement this function
    
      // Hash the new password before storing it in the database
      const hashedPassword = await bcrypt.hash(newPassword, 10);
    
      // Update the user's password
      user.password = hashedPassword;
    
      // Clear the reset token and expiration date
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
    
      // Save the updated user
      await user.save();
    
  
    
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Password reset",
        html: `
          <p  style="color: blue; font-size: 18px;"> Hello ${lastname},</p>
          <p>You have requested a reset of your email password and ${user.email} </p>
          <p >Your new password is: <h1 style="color: red; font-size: 24px;">${newPassword}<h1></p>
          <p>this password is temporary .</p>
          <p>Sincerely,</p>
          <p>freezepix technical service</p>
        `,
      };
    
      try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
          message: " Your new password has been included in the email.",
        });
      } catch (error) {
        return next(error);
      }
};
function generateRandomPassword() {
    const characters = '0123456789'; // Only include digits for a 6-digit password
    const password = Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
    return password;
  }
  
exports.resetPassword =async (req, res) => {
    try {
        const newPassword = req.body.newPassword; // Assuming you receive the new password in the request body
    
        // You can add authentication logic here to identify the user (e.g., user ID, token, etc.)
    
        // Hash the new password before updating it in the database
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        // Update the user's password in the database
        // You need to identify the user for which the password should be updated
        // For example, if you have the user's ID, you can do something like:
        const email = req.body.email; // Assuming you receive the email in the request body
        const user = await UserModel.findOne({ email });
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        user.password = newPassword;
    
        // Save the updated user
        await user.save();
    
        // Return a success response
        return res.status(200).json({ message: 'Password changed successfully' });
      } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).json({ message: 'Internal server error' });
      }
};
