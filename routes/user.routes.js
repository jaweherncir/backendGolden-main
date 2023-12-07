const  router = require('express').Router();
const authController = require("../controller/auth.controller");
const userController = require("../controller/user.controller");
const  multer = require("multer");
const path = require('path');
const fs = require('fs');
const shortid = require('shortid');
const { passwordResetValidator} = require('../utils/errors.utils');
const {getALLGalleryPublicByUSER, getALLGalleryPriveByUSER} = require("../controller/user.controller");
//const utlisateurController = require("../controller/utlisateur.controller");
/*
const my_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,path.join(path.dirname(__dirname),"client/public/uploads/profil"))
    },

    filename: (req, file, cb) => {
        cb(null,shortid.generate()+"_"+file.originalname)
    },

    limits: {
        fileSize: 1024 * 1024
    }
});
var uploadImageUser=multer({storage:my_storage})
// file filter function
const fileFilterFunction = (req, file, cb) => {
    const file_extention = path.extname(file.originalname);
    const allowedExtentions = [".jpg", ".jpeg", ".png"]
    if (!allowedExtentions.includes(file_extention)) {
        return cb(new Error('Only images are allowed'))
    }

    cb(null, true)
};
const upload = multer({ storage: my_storage },{fileFilter:fileFilterFunction})
var cpUpload = upload.fields([{ name: 'photo' }, { name: 'couvertir'}])
//to update image single
var uploadImageUser=multer({storage:my_storage})
*/
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

//authentification
router.post("/registre",authController.signUp);
//update user Etape1
router.put("/signupIdentifiant/:id",authController.updateEtape1)
//update code parinage ettape2
router.put("/signupParinage/:id",authController.updateCodeParinage)
//update to add photo profil
router.put("/signupApparance/:id",upload.single('profil'),authController.updatePhotoProfil)
router.put("/signupCertification/:id",upload.single('couvertir'),authController.updatePhotoCouvertir)
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
router.put("/signupCertificat/:id",uploadcertif.single('certificat'),authController.certificat)
//questianire
router.put("/etape1/:id",authController.Etape1)
router.put("/etape2/:id",authController.Etape2)
router.put("/etape3/:id",authController.Etape3)
router.put("/etape4/:id",authController.Etape4)
router.put("/etape5/:id",authController.Etape5)
router.post("/login",authController.signIn);
router.get("/logout",authController.logOut);
router.post('/email-password-send',authController.forgotPassword)
router.post('/change-password',authController.resetPassword)

//user display block
router.get("/",userController.getAllUsers);
router.get("/allusercount",userController.getAllCountUsers);
router.get("/alluserblock",userController.getAllUseerBlock);
router.get("/homme",userController.getAllUSerHOmme);
router.get("/allpseudo",userController.SearchPseduo);

router.get("/femme",userController.getAllUSerFemme);
router.get("/jour",userController.getCountUSerPArJour);
router.get("/semaine",userController.getCountUSerPArSemaine);
router.get("/mois",userController.getCountUSerParMois);
router.get("/trimestre",userController.getCountUSerParTrimestre);
router.get("/years",userController.getCountUSerParYears);






router.get("/:id",userController.userInfo);
router.put("/:id",userController.updateUser);
router.delete("/:id",userController.DeleteUser);
router.patch("/:id",userController.follow);// id de user qui deja connecter
router.patch("/unfollow/:id",userController.unfollow);
 
router.put("/online/:id",userController.online);
router.put("/ofline/:id",userController.offline);
router.put("/desactiver/:id",userController.desactiver);
router.put("/activer/:id",userController.activer);
router.patch("/blocked/:id",userController.BlockerUser);
router.patch("/retirer/:id",userController.RetirerUser);

router.patch("/acceptcontact/:id",userController.acceptfriend);

//upload
router.put("/update_profil_image/:id",upload.single('profil'),userController.updateProfil)
router.put("/update_couvertir_image/:id",upload.single('couvertir'),userController.updateCouvertir)
router.put("/prologue/:id",userController.updateUserPrologue)
router.put("/infogenerales/:id",userController.updateUserInfoGenerales)
router.put("/localisation/:id",userController.updateUserLocalaisation)
router.put("/valeur/:id",userController.updateUserValeurRecherches)
router.put("/apparence/:id",userController.updateUserApparance)
router.put("/detailsphysique/:id",userController.updateUserDetailsPhysique)
router.put("/personalite/:id",userController.updateUserPersonalite)
router.put("/habitudes/:id",userController.updateUserhabitudes)
router.put("/upload-couverture/:id",upload.single('couvertir'),userController.updateNouvellePhotoCouvertir)
router.put("/couverture/:id",userController.updatePhotoCouvertirFromGaleery)

router.get("/album/:id",userController.getALLAlbumByUserID)
router.get("/album/public/:id",getALLGalleryPublicByUSER)
router.get("/album/prive/:id",getALLGalleryPriveByUSER)
router.get("/profil/:id",userController.userInfoPArtieProfil);
router.get("/info/:id",userController.userInfoPArtieinformation);
router.get("/info/contact/:id",userController.userInfoContact);
router.get("/info/contact-bloque/:id",userController.userInfoBlocked);


router.get("/search/:id",userController.SearchProfilSolo);
module.exports=router;
