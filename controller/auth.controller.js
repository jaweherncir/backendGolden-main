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
const moment = require('moment');
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

//STEP  1 INSCRIPTION
module.exports.signUp = async (req, res) => {
    const { pseudo, nom, prenom, dateNass } = req.body;
  
    try {
      // Check if the pseudo is 'Couple', 'CPL', or 'Duo' (case-insensitive)
      const forbiddenPseudos = ['couple', 'cpl', 'duo'];
      if (forbiddenPseudos.includes(pseudo.toLowerCase())) {
        return res.status(400).send({ error: "Pseudo 'Couple', 'CPL', or 'Duo' is not allowed." });
      }
  
      // Check if the pseudo length exceeds 11 characters
      if (pseudo.length > 11) {
        return res.status(400).send({ error: 'Merci de choisir un Pseudo qui ne contient pas les mentions suivantes: COUPLE, CPL ou DUO.' });
      }
  
      // Check if the pseudo is already used
      const existingUser = await UserModel.findOne({ pseudo });
      if (existingUser) {
        return res.status(400).send({ error: 'Ce pseudo est déjà utilisé, merci d’en choisir un autre.' });
      }

      // Check if the first name and last name are the same
      if (nom.toLowerCase() === prenom.toLowerCase()) {
        return res.status(400).send({ error: 'Merci de choisir un prénom et un nom différents.' });
      }
      const birthDate = moment(dateNass);
      const today = moment();
      const age = today.diff(birthDate, 'years');
      if (age < 18) {
        return res.status(400).send({ error: 'Votre âge doit être supérieur ou égal à 18 ans pour vous inscrire.' });
    }
      const user = await UserModel.create({ pseudo, nom, prenom, dateNass,age });
  
      if (user) {
        // Create and sign a token
        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' }); // Change 'your_secret_key' to your actual secret key
  
        // Set the token in cookies
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 'maxAge' is set to 1 hour (in milliseconds)
  
        // Create and save related models (if needed)
        const newInvitModel = new InvitationModel({ userID: user._id });
        const newNotificationsModel = new NotificationsModel({ userID: user._id });
        const newRencontreModel = new RencontreModel({ userID: user._id });
  
        await newInvitModel.save();
        await newNotificationsModel.save();
        await newRencontreModel.save();
  
        res.status(201).send(user);
      }
    } catch (err) {
      const errors = singUpErrors(err);
      res.status(401).send({ errors });
    }
  };

//update etape1 
module.exports.updateEtape1 = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) // tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown: ' + req.params.id);
    
    try {
        const salt = await bcrypt.genSalt();
        const email = req.body.email;
        const emailVerif = await UserModel.findOne({ email });
        
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[#@]).{16,}$/;
        const isPasswordValid = passwordRegex.test(req.body.password);

        if (emailVerif) {
            return res.status(300).json({ errors: "Email already exists." });
        } else if (!isPasswordValid) {
            return res.status(400).json({
                errors: "Le mot de passe doit compter 16 caractères minimum avec au moins une majuscule, 1 chiffre et un caractère spécial (#, @)."
            });
        } else {
            await UserModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    $set: {
                        email: req.body.email,
                        numero: req.body.numero,
                        password: await bcrypt.hash(req.body.password, salt)
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true },
                (err, data) => {
                    if (!err) return res.send(data);
                    if (err) return res.status(500).send({ message: err });
                }
            );
        }
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

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
//petit rapelle
module.exports.PetitRapel= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    petitRapel: req.body.petitRapel,

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
//last step Inscription step 1
module.exports.PourFinir = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
    }

    try {
        const user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $set: { PourFinir: req.body.PourFinir ,step1mailSended:true} },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        if (user.verifier) {//If 'verifier' is already true, send a message indicating the account is verified
        return res.status(200).send({message:'Vous possédez déjà un compte actif au sein de notre plateforme.Le doublon de compte sur Golden Indigo est interdit'});
 }
        const smtpHost = 'smtppro.zoho.com';
        const smtpPort = 465;
        const smtpUser = 'Servicedesk@freezepix.com';
        const smtpPass = 'Freezepix2023'; // Please make sure to store sensitive information securely

        // Sending verification email logic
        const smtpTransport = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: true, // Use SSL
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        const userEmail = user.email;

        const mailOptions = {
            from: `${userEmail} <${smtpUser}>`, // Set sender as user's email
            to: 'Servicedesk@freezepix.com',
            subject: 'Account Verification',
            text: `User ${user.nom} needs to verify their account to complete the second part of the inscription under email ${user.email}.`
        };

        smtpTransport.sendMail(mailOptions, (error, response) => {
            if (error) {
                console.error(error);
                smtpTransport.close();
                return res.status(500).send({ message: 'Failed to send verification Account.' });
            } else {
                console.log('Verification Account sent successfully!');
                smtpTransport.close();
                return res.send(updatedUser);
            }
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

//admin valide le step 1
module.exports.VerifierStep1 = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) // Check if the ID is valid
        return res.status(400).send('ID unknown: ' + req.params.id);

    try {
        const user = await UserModel.findById(req.params.id); // Find the user by ID

        if (!user) {
            return res.status(404).send('User not found');
        }

        const smtpHost = 'smtppro.zoho.com';
        const smtpPort = 465;
        const smtpUser = 'Servicedesk@freezepix.com';
        const smtpPass = 'Freezepix2023'; // Please make sure to store sensitive information securely

        // Sending verification email logic
        const smtpTransport = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: true, // Use SSL
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        if (!user.verifier) {
            // If 'verifier' is not true, update it to true and send an email to the user
            await UserModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    $set: {
                        verifier: true
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true },
                async (err, data) => {
                    if (!err) {
                        // Sending email to the user
                        const mailOptions = {
                            from: 'Servicedesk@freezepix.com', // Sender address
                            to: user.email, // Receiver's email
                            subject: 'Account Verification',
                            html: `Bonjour ${user.prenom},</br>
                            Merci de l'intérêt porté à notre égard. Vous êtes bien enregistré. Si vous le désirez, vous pouvez finaliser votre inscription afin de devenir officiellement membre.</br></br>
                            Cordialement,</br>
                            L'équipe du Golden Indigo. <a href="https://yourverificationlink.com" style="display: inline-block; padding: 10px 20px; background-color: #BE7C00; color: #fff; text-decoration: none; border-radius: 5px;">FINALISER MON INSCRIPTION</a>`
                        };

                        try {
                            await smtpTransport.sendMail(mailOptions);
                            return res.send({ message: 'Nous vous avons envoyé un mail. Merci de cliquer sur le lien intégré pour finaliser votre pré-inscription.' });
                        } catch (error) {
                            return res.status(500).send({ message: error });
                        }
                    }
                    return res.status(500).send({ message: err });
                }
            );
        } else {
            return res.status(200).send({message:'Nous vous avons envoyé un mail. Merci de cliquer sur le lien intégré pour finaliser votre pré-inscription.'});
        }
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};
//admin refuse le compte 
module.exports.RefuserCompte = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) // Check if the ID is valid
        return res.status(400).send('ID unknown: ' + req.params.id);

    try {
        const currentDate = new Date().toLocaleDateString(); // Get current date in format xx/xx/xxxx

        await UserModel.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    compteRefuser: true,
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, data) => {
                if (!err) {
                    return res.send({
                        message: `Votre inscription a été refusée le ${currentDate}. Rendez-vous dans un an pour retenter votre chance, qui sait…`
                    });
                }
                return res.status(500).send({ message: err });
            }
        );
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

//admin banner le compte admin 

module.exports.BannerCompte = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) // Check if the ID is valid
        return res.status(400).send('ID unknown: ' + req.params.id);

    try {
        const currentDate = new Date().toLocaleDateString(); // Get current date in format xx/xx/xxxx

        await UserModel.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    bannerCompte: true,
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, data) => {
                if (!err) {
                    return res.send({
                        message: `Votre compte à été banni !Aucun retour en arrière possible.Vous ne pouvez plus ouvrir d’autre compte.`
                    });
                }
                return res.status(500).send({ message: err });
            }
        );
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};
//STEP 2 INSCRIPTION
module.exports.updatePhotoProfil = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
    }
    
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: `Golden/users/${req.params.id}/profile_photos`, // Store images in a folder based on user ID
        });

        // Update the user model with the photo URL
        const updatedUser = await UserModel.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    photo: result.secure_url // Store the secure URL of the uploaded image in the user model
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Update the user's album with the photo URL
        const updatedAlbum = await AlbumModel.findOneAndUpdate(
            { userId: req.params.id },
            {
                $push: {
                    photos: {
                        url: result.secure_url
                    }
                }
            },
            { new: true, upsert: true }
        );

        return res.send({  album: updatedAlbum }); // Send the updated user and album data
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

module.exports.updatePhotoCouvertir= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
    }
    
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: `Golden/users/${req.params.id}/couvertir_photos`, // Store images in a folder based on user ID
        });

        // Update the user model with the photo URL
        const updatedUser = await UserModel.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    couvertir: result.secure_url // Store the secure URL of the uploaded image in the user model
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Update the user's album with the photo URL
        const updatedAlbum = await AlbumModel.findOneAndUpdate(
            { userId: req.params.id },
            {
                $push: {
                    photos: {
                        url: result.secure_url
                    }
                }
            },
            { new: true, upsert: true }
        );

        return res.send({  album: updatedAlbum }); // Send the updated user and album data
    } catch (err) {
        return res.status(500).json({ message: err });
    }
   
   
   
   
   
   
   
      
   
   }
//add certifcat









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
module.exports.certificatPlus = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
    }
    
    try {
        const certificatObjects = [];

        // Upload multiple certification photos to Cloudinary
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: `Golden/users/${req.params.id}/certification_photos`
            });
            certificatObjects.push({ certif: result.secure_url, etat: 'NON' });
        }

        // Find the user by ID and update their certificat field
        const updatedUser = await UserModel.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $push: {
                    certificat: { $each: certificatObjects } // Add new certification photos with 'encours' status
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.send({ user: updatedUser }); // Send the updated user data
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

//Questionnaire api  

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
module.exports.signIn = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by their email
      const user = await UserModel.findOne({ email });
  
      if (user) {
         // Create and sign a token
         const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' }); // Change 'your_secret_key' to your actual secret key
  
         // Set the token in cookies
         res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 'maxAge' is set to 1 hour (in milliseconds)
        // If the user is found, compare passwords
        const auth = await bcrypt.compare(password, user.password);
  
        if (auth) {
          // Passwords match, user is authenticated
          res.status(200).json({ message: 'Login successful', user });
        } else {
          // Passwords don't match
          res.status(401).json({ message: 'Incorrect password' });
        }
      } else {
        // User not found
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      // Handle any errors that occur
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};
module.exports.logOut=async (req,res) =>{
   
    res.clearCookie("token"); // Clears the token cookie
   
    res.json({ message: "Logged out successfully" });



}
exports.forgotPassword = async (req, res) => {
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
  
    if (!user) {
      return res.status(404).json({ message: "Il semblerait qu’il y ait une erreur. Votre adresse mail est invalide. Merci de recommencer." });
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
        <p  style="color: blue; font-size: 18px;"> Hello ${user.name},</p>
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
        message: "Your new password has been included in the email.",
      });
    } catch (error) {
      return next(error);
    }
  };
  
function generateRandomPassword() {
    const length = 16;
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numericChars = '0123456789';
    const specialChars = '#@!$%^&*()_+{}[]|;:,<>.?/~';
  
    const allChars = uppercaseChars + lowercaseChars + numericChars + specialChars;
  
    let password = '';
    password += getRandomChar(uppercaseChars);
    password += getRandomChar(numericChars);
    password += getRandomChar(specialChars);
  
    for (let i = 0; i < length - 3; i++) {
      password += getRandomChar(allChars);
    }
  
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
  
  function getRandomChar(charSet) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet[randomIndex];
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

//avec algorithme de prohibé 
 function GetIDPhotoFromAlbum(list){
    var last = [].slice.call(list).pop()._id;
    return last


}














