const  router = require('express').Router();
const authController = require("../controller/auth.controller");
const userController = require("../controller/user.controller");
const  multer = require("multer");
const path = require('path');
const fs = require('fs');
const shortid = require('shortid');
const { passwordResetValidator} = require('../utils/errors.utils');
const {getALLGalleryPublicByUSER, getALLGalleryPriveByUSER} = require("../controller/user.controller");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "client/public/uploads/album");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const storagecerttificat = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "client/certificat");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});


const upload = multer({ storage: storage });
const uploadcertif = multer({ storage: storagecerttificat });
//test final
//1 register 
//aregister
router.post("/registre",authController.signUp);
//update user Etape1
router.put("/signupIdentifiant/:id",authController.updateEtape1)
//update code parinage ettape2
router.put("/signupParinage/:id",authController.updateCodeParinage)
//petit rapell API
router.put("/petitRapel/:id",authController.PetitRapel)
router.put("/pourfinir/:id",authController.PourFinir)
//admin verified step1 of account
router.put("/verifierStep1/:id",authController.VerifierStep1)
//compte refuser
router.put("/compteRefuser/:id",authController.RefuserCompte)
//baner compte 
router.put("/compteBanner/:id",authController.BannerCompte)
//update to add photo profil
router.put("/addProfilImage/:id",upload.single('profil'),authController.updatePhotoProfil)
router.put("/signupCouverture/:id",upload.single('couvertir'),authController.updatePhotoCouvertir)
router.put("/signupGenre/:id",authController.updateGenre)
router.put("/signupOrientation/:id",authController.orientationsexe)
router.put("/signupLangue/:id",authController.langue)
router.put("/signupOrgine/:id",authController.orgine)
router.put("/signupProfession/:id",authController.prfession)
//router.put("/signupUpdate9/:id",authController.attirance)
router.put("/signupRelation/:id",authController.relationRechercher)
router.put("/signupValeur/:id",authController.valeur)
router.put("/signupInteret/:id",authController.interet)
router.put("/signupMusique/:id",authController.musique)
router.put("/signupCaractere/:id",authController.caractere)
router.put("/signupPersonalite/:id",authController.personalite)
router.put("/signupShiloutte/:id",authController.sihloutte)
router.put("/signupCertificat/:id",uploadcertif.array('certificat',2),authController.certificatPlus)
//questianire
router.put("/etape1/:id",authController.Etape1)
router.put("/etape2/:id",authController.Etape2)
router.put("/etape3/:id",authController.Etape3)
router.put("/etape4/:id",authController.Etape4)
router.put("/etape5/:id",authController.Etape5)
//password
router.post('/email-password-send',authController.forgotPassword)
router.post('/change-password',authController.resetPassword)
//login logout
router.post("/login",authController.signIn);
router.get("/logout",authController.logOut);

//Regalege compte of user 
router.get("/:id",userController.userInfo);
router.delete("/:id",userController.DeleteUser);
router.post("/sendProblem",userController.sendraport)
//update user 
router.put("/:id",userController.updateUser);
//update passwrod ??
router.put("/updatepassword/:id",userController.updateUserPassword);
router.put("/updatePseudo/:id",userController.updatePseudo);
//update certif  doubel face in reglage 
router.post("/getCertifcation",userController.sendMailToGetCertification)
router.post("/recupirerInfo/:id",userController.recuipererInfoUser)

//compte piraté
router.post("/search",authController.findUserByEmail);

//profil user solo 
router.get("/info/:id",userController.userInfoPArtieinformation);
router.put("/prologue/:id",userController.updateUserPrologue)
router.put("/infogenerales/:id",userController.updateUserInfoGenerales)
router.put("/localisation/:id",userController.updateUserLocalaisation)
router.put("/valeur/:id",userController.updateUserValeurRecherches)
router.put("/apparence/:id",userController.updateUserApparance)
router.put("/detailsphysique/:id",userController.updateUserDetailsPhysique)
router.put("/personalite/:id",userController.updateUserPersonalite)
router.put("/habitudes/:id",userController.updateUserhabitudes)
//partie profil solo bannier
router.put("/upload-couverture/:id",upload.single('couvertir'),userController.updateNouvellePhotoCouvertir)
router.put("/couverture/:id",userController.updatePhotoCouvertirFromGaleery)


//viste profil user 
router.get("/search/:id",userController.SearchProfilSolo);
router.patch("/blocked/:id",userController.BlockerUser);
router.patch("/retirer/:id",userController.RetirerUser);
router.patch("/acceptcontact/:id",userController.acceptfriend);
router.get("/info/contact/:id",userController.userInfoContact);
router.get("/info/contact-bloque/:id",userController.userInfoBlocked);
//Contact & Affichage
//debloquer user 
router.patch("/info/contact-Debloque/:id",userController.userInfoDebocked);
//get liste user bloced 
router.get("/alluserblock",userController.getAllUseerBlock);
router.patch("/signalercompte/:id",userController.signaleCompte);
//choisir nombres des lettre a achéter
router.patch('/nbrelettre/:id',userController.nbLettreAcheter);
//liste friends of user 
router.get('/listeFriend/:id',userController.getUserFriends);
//visiblité liste friends 
router.put('/VisiblitelisteFriend/:id',userController.updateFriendVisibility);
//my compte 
router.put("/online/:id",userController.online);
router.put("/ofline/:id",userController.offline);
router.put("/desactiver/:id",userController.desactiver);
router.put("/activer/:id",userController.activer);










 



router.patch("/:id",userController.follow);// id de user qui deja connecter
router.patch("/unfollow/:id",userController.unfollow);
 



//upload
router.put("/update_profil_image/:id",upload.single('profil'),userController.updateProfil)
router.put("/update_couvertir_image/:id",upload.single('couvertir'),userController.updateCouvertir)




router.get("/album/:id",userController.getALLAlbumByUserID)
router.get("/album/public/:id",getALLGalleryPublicByUSER)
router.get("/album/prive/:id",getALLGalleryPriveByUSER)
router.get("/profil/:id",userController.userInfoPArtieProfil);












//user display block
router.get("/",userController.getAllUsers);
router.get("/allusercount",userController.getAllCountUsers);

router.get("/homme",userController.getAllUSerHOmme);
router.get("/allpseudo",userController.SearchPseduo);

router.get("/femme",userController.getAllUSerFemme);
router.get("/jour",userController.getCountUSerPArJour);
router.get("/semaine",userController.getCountUSerPArSemaine);
router.get("/mois",userController.getCountUSerParMois);
router.get("/trimestre",userController.getCountUSerParTrimestre);
router.get("/years",userController.getCountUSerParYears);
module.exports=router;
