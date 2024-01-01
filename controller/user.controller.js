const userModel = require("../models/user.model");
const moment = require("moment");
const NotificationModel = require("../models/notifications.model");
const InvitationMedel = require("../models/invitation.model");
const AlbumModel = require("../models/album.model");

const ewallet=require("../models/Ewallet.model")
const bcrypt = require('bcrypt');
const rencontre=require("../models/Rencontre.model")
const EvenementProModel = require("../models/evenementpro");
const evenementprive=require("../models/evenementprive")
const jumlage =require ("../models/jumlage.model")
const pagepro =require ("../models/pagepro.model")
const post =require ("../models/post.model")
const fs = require("fs");
const UserModel = require("../models/user.model");
const nodemailer = require("nodemailer");
const ObjectID = require("mongoose").Types.ObjectId;
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "dm0c8st6k",
    api_key: "541481188898557",
    api_secret: "6ViefK1wxoJP50p8j2pQ7IykIYY"
  });
const PDFDocument = require('pdfkit');

const path = require('path');
  module.exports.userInfo= async (req,res) =>{
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);

    userModel.findById(req.params.id, (err,data)=>{
        if(!err)
            res.send(data);
        else
            console.log('ID unknow : '+err);

    });
}



module.exports.DeleteUser = async (req, res) => {
    const id = req.params.id;

    try {
      // Find the user by ID
      const user = await UserModel.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Delete user
      await UserModel.findByIdAndRemove(id);
      // Delete associated notifications
      await NotificationModel.deleteMany({ userID: id });
       // Delete associated orderq
      await InvitationMedel.deleteMany({ userID: id });
       // Delete associated panier
      await AlbumModel.deleteMany({ userId: id });
      await ewallet.deleteMany({ userId: id });
      await rencontre.deleteMany({ userID: id });
      await EvenementProModel.deleteMany({ userId: id });
      await evenementprive.deleteMany({ userId: id });
      await jumlage.deleteMany({ userId: id });
      await pagepro.deleteMany({ userId: id });
      await post.deleteMany({ userId: id });
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
};

//send rapport apres la suppression 
module.exports.sendraport = async (req, res) => {
    const { from, to, subject, text } = req.body;
  
    // Set up transporter for sending email to the host
    const smtpHost = 'smtppro.zoho.com';
    const smtpPort = 465;
    const smtpUser = 'Servicedesk@freezepix.com';
    const smtpPass = 'Freezepix2023'; // Please make sure to store sensitive information securely
  
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  
    const mailOptionsToHost = {
      from: `"${from}" <${smtpUser}>`,
      to: "Servicedesk@freezepix.com",
      subject,
      text,
    };
  
    // Send email to the host
    transporter.sendMail(mailOptionsToHost, async (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while sending the email.' });
      } else {
        console.log('Email sent to host: ' + info.response);
  
        // Assuming the host responds with an email to confirm
        const mailOptionsFromHost = {
          from: "Servicedesk@freezepix.com",
          to: from, // Change this to the user's email (assuming 'from' contains user's email)
          subject: ' Email de Confirmation',
          text: 'Vous venez de recevoir un email confirmant la suppression de votre compte.Nous vous souhaitons le meilleur pour la suite',
        };
  
        // Send confirmation email from the host to the user
        transporter.sendMail(mailOptionsFromHost, (error, info) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred while sending the confirmation email.' });
          } else {
            console.log('Confirmation Email sent: ' + info.response);
            res.json({ message: 'Emails sent successfully!' });
          }
        });
      }
    });
  };
  module.exports.updateUser= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    email: req.body.email,
                    nomfamille: req.body.nomfamille,
                    prenom: req.body.prenom,
                    nom: req.body.nom,
                    datenass: req.body.datenass,
                    pays: req.body.pays,
                    ville: req.body.ville,
                    numero: req.body.numero,
                    langueCourant: req.body.langueCourant,
                    langueSecondaire: req.body.langueSecondaire,
                    profession: req.body.profession,
                    silhoutte: req.body.silhoutte,
                    orgineethnique: req.body.orgineethnique,
                    nature: req.body.nature,
                    orientationsexe: req.body.orientationsexe,
                    preferences: req.body.preferences,
                    valeurscroyances: req.body.valeurscroyances,
                    typerelation: req.body.typerelation,
                    votrecaractere: req.body.votrecaractere,
                    temperament: req.body.temperament,
                    interet: req.body.interet,
                    typerelation: req.body.typerelation,





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
//update password

module.exports.updateUserPassword = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;

    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Votre mot de passe et votre confirmation ne correpondent pas, merci de vérifier.' });
        }

        // Password complexity requirements
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{16,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message: 'Votre mot de passe doit être composé d’au moins 16 caractères et doit comporter au moins une majuscule,un caractèrespécial et un chiffre.'
            });
        }

        // Check if the new password contains at least one uppercase letter
        if (!/[A-Z]/.test(newPassword)) {
            return res.status(400).json({ message: 'Votre mot de passe doit être composé d’au moins 16 caractères et doit comporter au moins une majuscule, un caractère spécial et un chiffre.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        const updatedUser = await user.save();

        return res.send(updatedUser);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
module.exports.updatePseudo = async (req, res) => {
    const userId = req.params.id;

    if (!ObjectID.isValid(userId)) {
        return res.status(400).send('Invalid ID: ' + userId);
    }

    const { pseudo } = req.body;

    try {
        // Check if the new pseudo is already associated with another account
        const existingUser = await userModel.findOne({ pseudo: pseudo });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({ message: 'Ce pseudo est déjà associé à un autre compte' });
        }

        // Check if the pseudo is available (libre)
        const currentUser = await userModel.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's pseudo if it's associated with the current user
        if (currentUser.pseudo !== pseudo) {
            currentUser.pseudo = pseudo;
            const updatedUser = await currentUser.save();
            return res.send(updatedUser);
        } else {
            return res.status(200).json({ message: 'Ce pseudo est libre' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.updateProfil = async (req, res) => {
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
  };

//envoyer email pour obtenir le certifcation
module.exports.sendMailToGetCertification = async (req, res) => {
    const { from} = req.body;
    // Set up transporter for sending email to the host
    const smtpHost = 'smtppro.zoho.com';
    const smtpPort = 465;
    const smtpUser = 'Servicedesk@freezepix.com';
    const smtpPass = 'Freezepix2023'; // Please make sure to store sensitive information securely
  
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: true, // Use SSL
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const mailOptions = {
    from: `"${from}" <${smtpUser}>`, // Include the user's email in the "from" field
    to: "Servicedesk@freezepix.com",
    subject:"demande de verification mon certification",
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while sending the email.' });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ message: 'Email sent successfully!' });
    }
  });
};
const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

module.exports.recuipererInfoUser = async (req, res) => {
  console.log(req.params);
  
  if (!ObjectID.isValid(req.params.id)) { // Check if the ID is valid
    return res.status(400).send('ID unknown: ' + req.params.id);
  }

  userModel.findById(req.params.id, async (err, userData) => {
    if (!err && userData) {
      const currentTime = Date.now();
      const lastEmailSentAt = userData.lastEmailSentAt || 0;

      // Check if a month has passed since the last email
      if (currentTime - lastEmailSentAt >= ONE_MONTH) {
        // Update the last email sent timestamp to the current time
        userData.lastEmailSentAt = currentTime;
        await userData.save();

        // Sending email
        const smtpHost = 'smtppro.zoho.com';
        const smtpPort = 465;
        const smtpUser = 'Servicedesk@freezepix.com';
        const smtpPass = 'Freezepix2023'; // Please make sure to store sensitive information securely

        // Set up transporter for sending email to the host (Zoho Mail)
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: true,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const mailOptions = {
          from: `<${smtpUser}>`,
          to: userData.email,
          subject: 'User Information',
          html: `
            <h1>User Information</h1>
            <p><strong>Name:</strong> ${userData.nom}</p>
            <p><strong>Email:</strong> ${userData.email}</p>
            <p><strong>Phone Number:</strong> ${userData.numero}</p>
            <p><strong>Code Parinage:</strong> ${userData.codeParinage}</p>
            <p><strong>Phone Number:</strong> ${userData.prenom}</p>
            <p><strong>Code Parinage:</strong> ${userData.dateNass}</p>
            <!-- Add more user details as needed -->
          `,
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          console.log('Email sent with user information:', info.response);
          res.json({ message: 'Email sent successfully with user information!' });
        } catch (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ error: 'Error sending email with user information' });
        }
      } else {
        // If a month hasn't passed, don't send the email
        res.json({ message: 'Email already sent this month. Not sending again.' });
      }
    } else {
      console.log('Error finding user: ' + err);
      res.status(500).json({ message: 'Error finding user' });
    }
  });
};

module.exports.updateCouvertir=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
      }
    
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: `Golden/users/couvertir_images/${req.params.id}`, // Store images in a folder based on user ID
        });
    
        await UserModel.findByIdAndUpdate(
          { _id: req.params.id },
          {
            $set: {
                couvertir: result.secure_url // Store the secure URL of the uploaded image
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

// recherche profil solo 
module.exports.SearchProfilSolo= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await userModel.find(
            {pseudo: { $regex: req.body.pseudo } },
            (err,profil) =>{
                if (!err) return res.send(profil);
                if (err) return  res.status(500).send({message: err});
            }
        ).select("-password")
    }catch(err) {

        return res.status(500).json({message: err});
    }

}
module.exports.acceptfriend= async (req,res)=>{
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.usersender) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        // add to the follower liste
            await InvitationMedel.findOneAndUpdate({
                "userID":req.params.id
            },{
                $pull:{reciverReqFreinds:{_id:req.body.usersender}}
            },{
                new: true, upsert: true
            });
           let userinvitsender =  await InvitationMedel.findOneAndUpdate({
                "userID":req.body.usersender
            },{
                $pull:{senderReqFreinds:{_id:req.params.id}}
            },{
                new: true, upsert: true
            });
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
            {new: true, upsert:true}
            );
        await NotificationModel.findOneAndUpdate({
            "userID":req.params.id
        },{
            $pull:{Interaction:{_id:req.body.idnotif}}
        },{
            new: true, upsert: true
        }),
            await NotificationModel.findOneAndUpdate({
                "userID":req.body.usersender
            },{
                $addToSet:{Interaction:{
                        usersenderid:req.params.id,
                        timestamp:new Date().getTime(),
                        model:"contact",
                        text:"Vous êtes maintenant en contact avec"
                    }}
            },{
                new: true, upsert: true
            },(err,rep)=>{
                if (err)
                    return res.status(400).json(err);
                else{
                    //console.log(rep.Interaction[rep.Interaction.length -1]._id)
                    console.log(req.body.usersender)
                    return res.status(200).send({ivitation:userinvitsender,notif:rep.Interaction[rep.Interaction.length -1]})
                    //return res.status(201).json(rep.Interaction[rep.Interaction.length -1]);
                }

            })


    }catch (err){
        return res.status(500).json({message: err});

    }

}
module.exports.BlockerUser=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.user) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {

        // add to the follower liste
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id}
        ,{
            $pull:{friends:req.body.user}
        },{
            new: true, upsert: true
        }),

            await UserModel.findByIdAndUpdate({
                _id:req.body.user
            },{
                $pull:{friends:req.params.id}
            },{
                new: true, upsert: true
            }),
            await UserModel.findByIdAndUpdate({
                _id:req.params.id
            },{
                $addToSet:{blocked:req.body.user}
            },{
                new: true, upsert: true
            },(err,reponse)=>{
                if(!err)
                    res.status(201).send(reponse);
                else
                    res.status(401).send(err);
            });

    }catch (err){
        return res.status(500).json({message: err});

    }

}
module.exports.RetirerUser=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.user) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {

        // add to the follower liste
        await UserModel.findByIdAndUpdate(
            {_id:req.params.id}
            ,{
                $pull:{friends:req.body.user}
            },{
                new: true, upsert: true
            }),

            await UserModel.findByIdAndUpdate({
                _id:req.body.user
            },{
                $pull:{friends:req.params.id}
            },{
                new: true, upsert: true
            }),
            await UserModel.findByIdAndUpdate({
                _id:req.params.id
            },{
                $addToSet:{retirer:req.body.user}
            },{
                new: true, upsert: true
            },(err,reponse)=>{
                if(!err)
                    res.status(201).send(reponse);
                else
                    res.status(401).send(err);
            });

    }catch (err){
        return res.status(500).json({message: err});

    }

}
module.exports.userInfoContact = async (req, res) => {
   
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknown: " + req.params.id);
    }

    try {
        const user = await UserModel.findById(req.params.id)
            .populate ({
                path: 'friends',
                select: ['pseudo', 'photo', 'dateNass', 'genre'],
                populate: {
                    path: 'photo',
                    select: 'picture'
                }
            })
            .select('friends');

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send(user.friends);
    } catch (err) {
        console.error("Error fetching user's friends:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
module.exports.userInfoBlocked = async (req, res) => {
    try {
        // Get the current user's ID or any identifier to fetch their blocked users list
        const userId = req.params.id; // Replace this with your authentication method to get the user ID
    
        // Fetch the user by ID
        const user = await UserModel.findById(userId).populate('blocked', 'pseudo'); // Populate 'blocked' field with 'pseudo'
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Access the list of blocked users
        const blockedUsers = user.blocked;
    
        res.status(200).json({ blockedUsers });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};
module.exports.userInfoDebocked = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.user))
        return res.status(400).send('ID unknown ' + req.params.id);

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { blocked: req.body.user } // Removing the user from the blocked array
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.status(200).send(updatedUser);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};




  

//api admin 
module.exports.getAllUsers= async (req,res) =>{
    const users = await userModel.find().select('-password');//afiicher touts les information des users sauf password
    res.status(200).json(users);

}



module.exports.getAllUseerBlock= async (req,res) =>{
    const users = await userModel.find().select('blocked')
        .populate({path:'blocked',select:['nom','prenom','email','genre','numero','villeconnue','dateNass']});//afiicher touts les information des users sauf password
    res.status(200).json(users[0].blocked);

}




module.exports.getAllCountUsers= async (req,res) =>{
    const users = await userModel.find();//afiicher touts les information des users sauf password
    res.status(200).json({result:users.length});
}



module.exports.follow = async (req,res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        // add to the follower liste
        await userModel.findByIdAndUpdate(
            req.params.id,//id d personne qui faire labonne
            {
                $addToSet : {following: req.body.idToFollow}
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );
        //add to following liste
        // 9owet el request patch est non put
        await userModel.findByIdAndUpdate(
            req.body.idToFollow,
            {$addToSet : {followers : req.params.id}},
            {new: true, upsert:true},
            (err,data) =>{
                //if (!err) res.status(201).json(data); impossible de routerner deux repponse status
                if (err) return res.status(400).json(err);

            }
        )
    }catch (err){
        return res.status(500).js({message: err});

    }

}
module.exports.unfollow = async (req,res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnFollow))
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        // add to the follower liste
        await userModel.findByIdAndUpdate(
            req.params.id,//id d personne qui faire labonne
            {
                $pull : {following: req.body.idToUnFollow} //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    res.status(201).json(data);
                else return res.status(400).json(err);

            }
        );
        //add to following liste
        // 9owet el request patch est non put
        await userModel.findByIdAndUpdate(
            req.body.idToUnFollow,
            {$pull : {followers : req.params.id}},
            {new: true, upsert:true},
            (err,data) =>{
                //if (!err) res.status(201).json(data); impossible de routerner deux repponse status
                if (err) return res.status(400).json(err);

            }
        )


    }catch (err){
        return res.status(500).json({message: err});

    }

}



















module.exports.online= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},//id d personne qui faire labonne
            {
                $set : {status: true} //$pull reterai (-) dun valeur specifique denattribut following
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
module.exports.offline= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},//id d personne qui faire labonne
            {
                $set : {status: false} //$pull reterai (-) dun valeur specifique denattribut following
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
module.exports.desactiver= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},//id d personne qui faire labonne
            {
                $set : {deactivate: true} //$pull reterai (-) dun valeur specifique denattribut following
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
module.exports.activer= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},//id d personne qui faire labonne
            {
                $set : {deactivate: false} //$pull reterai (-) dun valeur specifique denattribut following
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
module.exports.addblock= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},//id d personne qui faire labonne
            {
                $addToSet : {blocked: req.body.id} //$pull reterai (-) dun valeur specifique denattribut following
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
async function suprimernotifsContact(idbody,idparams){
    await NotificationModel.findOneAndUpdate(
        {"userID":idbody},
        {
            $pull:{
                friendsreciver:{
                    userreciverid:idparams,

                }
            }
        },
        {new:true},
        (errr,dataa)=>{}
    );

}





module.exports.updateUserPrologue= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    prologue:req.body.prologue
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
module.exports.updateUserInfoGenerales= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    prenom:req.body.prenom,
                    orgine:req.body.orgine,
                    signeastrologique:req.body.signeastrologique,
                    ascendant:req.body.ascendant,
                    domainepro:req.body.domainepro
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

module.exports.updateUserLocalaisation= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    langue:req.body.langue,
                    villeconnue:req.body.villeconnue

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
module.exports.updateUserValeurRecherches= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    valeur:req.body.valeur,
                    relationRechercher:req.body.relationRechercher

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
module.exports.updateUserApparance= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    Apparence:{
                        taille:req.body.taille,
                        silhouette:req.body.silhouette,
                        yeux:req.body.yeux,
                        cheveux:req.body.cheveux,
                        pilositeCorporelle:req.body.pilositeCorporelle,
                        pilositeFaciale:req.body.pilositeFaciale,




                    }}
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
module.exports.updateUserDetailsPhysique= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    DetailsPhysique:{
                        Tatouage:req.body.Tatouage,
                        PiercingCorporel:req.body.PiercingCorporel,
                        PiercingFacial:req.body.PiercingFacial
                    }}
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
module.exports.updateUserPersonalite= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    Personnalite:{
                        Temperament:req.body.Temperament,
                        Sociabilite:req.body.Sociabilite,
                        Caractere:req.body.Caractere
                    }}
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
module.exports.updateUserhabitudes= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    Habitude:{
                        RythmeDeSoir:req.body.RythmeDeSoir,
                        Alcool:req.body.Alcool,
                        Cigarette:req.body.Cigarette,
                        RegimeAlimentaire:req.body.RegimeAlimentaire,
                        Hobbies:req.body.Hobbies,
                        GoutsMusicaux:req.body.GoutsMusicaux
                    }}
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

module.exports.getAllUSerHOmme= async (req,res) =>{
    try {
        var array_genre = ["HOMME"];
         await userModel.find({
            genre : {$in: array_genre }},
            (err,genreofuser)=>{
            if( err)
                res.status(401).json({err})
            else
                return res.status(200).json({result:genreofuser.length});

        });

    }catch (err){
        return res.status(500).json({message: err});
    }


}
module.exports.getAllUSerFemme= async (req,res) =>{
    try {
        var array_genre = ["FEMME"];
        await userModel.find({
                genre : {$in: array_genre }},
            (err,genreofuser)=>{
                if( err)
                    res.status(401).json({err})
                else
                    return res.status(200).json({result:genreofuser.length});

            });

    }catch (err){
        return res.status(500).json({message: err});
    }


}
module.exports.getCountUSerPArJour= async (req,res) =>{
    try {
       // var todayDate = new Date().toISOString().slice(0, 10);
        var start = moment().subtract(24, 'hours').toDate();
        //console.log(start)


        await userModel.find({
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
module.exports.getCountUSerPArSemaine= async (req,res) =>{
    try {
        // var todayDate = new Date().toISOString().slice(0, 10);
        var start = moment().subtract(7, 'days').toDate();
        console.log(start)


        await userModel.find({
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
module.exports.getCountUSerParMois= async (req,res) =>{
    try {
        // var todayDate = new Date().toISOString().slice(0, 10);
        var start = moment().subtract(1, 'months').toDate();
        console.log(start)


        await userModel.find({
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
module.exports.getCountUSerParTrimestre= async (req,res) =>{
    try {
        // var todayDate = new Date().toISOString().slice(0, 10);
        var start = moment().subtract(3, 'months').toDate();
        console.log(start)

        await userModel.find({
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
module.exports.getCountUSerParYears= async (req,res) =>{
    try {
        // var todayDate = new Date().toISOString().slice(0, 10);
        var start = moment().subtract(1, 'years').toDate();
        console.log(start)


        await userModel.find({
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
module.exports.userInfoPArtieProfil = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    userModel.findById(req.params.id, (err, docs) => {
        if (!err) {
            res.send(docs);

        }
        else console.log("ID unknown : " + err);
    }).select('genre pseudo  photo dateNass')
        .populate({path:'photo',select:['picture']});
};
module.exports.userInfoPArtieinformation = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

     await userModel.findById(req.params.id, (err, docs) => {
        if (!err) {
            res.send(docs);
        }
        else console.log("ID unknown : " + err);
    })
        .select('-genre -pseudo -couvertir -photo -dateNass -password')
        .populate({path:'friends',select:['pseudo','photo','dateNass','genre']})
        .populate({path:'friends.photo.picture',select:['picture']})
        .populate({path:'blocked',select:['pseudo','photo','dateNass','genre']})
        .populate({path:'retirer',select:['pseudo','photo','dateNass','genre']});


};



module.exports.SearchPseduo= async (req,res) =>{
    const listpseudo=[];
        await userModel.find((err,pseudo)=>{
            if (!err)
            {
                for(let i=0;i<pseudo.length ; i++){
                    listpseudo.push(pseudo[i].pseudo)
                }
                return res.status(200).send(listpseudo);

            }
            else
                return res.status(401).send(err);
        }).select("pseudo -_id");

}

module.exports.updateNouvellePhotoCouvertir= async (req,res) =>{
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
        const addphotocouverture = await albumModel.save();
        if (addphotocouverture) {
            await UserModel.findByIdAndUpdate(
                {_id: req.params.id},
                {
                    $set: {
                        couvertir: addphotocouverture._id
                    }
                },
                {new: true, upsert: true},
                (errr, data) => {
                    if (!errr) res.status(201).send(data);
                    else res.status(401).send(errr)

                }
            );

        }
    } catch (err) {

        return res.status(500).json({message: err});
    }

}
module.exports.getALLAlbumByUserID=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id);

    AlbumModel.find({userId:req.params.id},
        (err,data)=>{
        if(!err)
            res.status(201).send(data);
        else
            res.status(401).send(err);
            //console.log('ID unknow : '+err);

    });
}
module.exports.updatePhotoCouvertirFromGaleery= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
            await UserModel.findByIdAndUpdate(
                {_id: req.params.id},
                {
                    $set: {
                        couvertir: req.body.idalbum
                    }
                },
                {new: true, upsert: true},
                (errr, data) => {
                    if (!errr) res.status(201).send(data);
                    else res.status(401).send(errr)

                }
            );


    } catch (err) {

        return res.status(500).json({message: err});
    }

}

module.exports.getALLGalleryPublicByUSER=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id);

    AlbumModel.find({userId:req.params.id ,visible:true},
        (err,data)=>{
            if(!err)
                res.status(201).send(data);
            else
                res.status(401).send(err);
            //console.log('ID unknow : '+err);

        });
}
module.exports.getALLGalleryPriveByUSER=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id);

    AlbumModel.find({userId:req.params.id ,visible:false},
        (err,data)=>{
            if(!err)
                res.status(201).send(data);
            else
                res.status(401).send(err);
            //console.log('ID unknow : '+err);

        });
}


