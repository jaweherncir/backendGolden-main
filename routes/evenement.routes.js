const router= require("express").Router();
const evenementcontroller=require("../controller/evenement.controller");
const  multer = require("multer");
const storagebaniere = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "client/event/pro");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const uploadbanier = multer({ storage: storagebaniere });

//creer evenement
router.post('/pro',evenementcontroller.createEvenementPro);
router.put('/pagepro/:id',evenementcontroller.createEvenementProPageProRIB);
router.put('/nom/:id',evenementcontroller.createEvenementProNom);
router.put('/banniere/:id',uploadbanier.single('banniere'),evenementcontroller.createEvenementProPhotoBaniere);
router.put('/prix/:id',evenementcontroller.createEvenementProPrixSoloDuo);
router.put('/lieu/:id',evenementcontroller.createEvenementProLieux);
router.put('/datedebut/:id',evenementcontroller.createEvenementProDateDebut);
router.put('/datefin/:id',evenementcontroller.createEvenementProDateFin);
router.put('/participant/langues/:id',evenementcontroller.createEvenementProParticipantLanguageParle);
router.put('/participant/genre/:id',evenementcontroller.createEvenementProParticipantGenreConcernnes);
router.put('/participant/sexualite/:id',evenementcontroller.createEvenementProParticipantSexualiteConcernnes);
router.put('/typedesoire/categories/:id',evenementcontroller.createEvenementProTypeDeSoireeAddCategorie);
router.put('/typedesoire/musique/:id',evenementcontroller.createEvenementProTypeDeSoireeAddAmianceMusicales);
router.put('/typedesoire/description/:id',evenementcontroller.createEvenementProTypeDeSoireeAddDescripition);
router.put('/typedesoire/dresscode/:id',evenementcontroller.createEvenementProTypeDeSoireeAddDressCode);
router.put('/parametres/:id',evenementcontroller.createEvenementProParametres);
router.put('/parametres/autorisation/:id',evenementcontroller.createEvenementProParametresChoisirRole);
router.put('/avantage/:id',evenementcontroller.createEvenementProAvantage);
router.put('/avantage/update/:idevent/:idavantage',evenementcontroller.createEvenementProUpdateAvantage);
router.delete('/avantage/delete/:idevent/:idavantage',evenementcontroller.createEvenementProDeleteAvantage);
router.put('/fin/:id',evenementcontroller.createEvenementProPubliez);
router.get('/getAllEvent',evenementcontroller.getAllEvent);

router.get('/alleventcount',evenementcontroller.getAllCountEvent);
router.get('/jour',evenementcontroller.getCountEventPArJour);
router.get('/semaine',evenementcontroller.getCountEventPArSemaine);
router.get('/mois',evenementcontroller.getCountEventPArMois);
router.get('/trimestre',evenementcontroller.getCountEventPArTrimestre);
router.get('/years',evenementcontroller.getCountEventPArYears);










//invitation evenement
router.patch('/invit-event/:id',evenementcontroller.invitationEvenement);
//supprimer evenement pro
router.delete('/pro/:id',evenementcontroller.DeleteEventPro);
//get all event pro
router.get('/pro/all',evenementcontroller.getAllEvenetPro);
//get event pro by id
router.get('/pro/:id',evenementcontroller.getEventProByID);
//demande participant evenement pro|prive par user
router.patch('/demande-event/:id',evenementcontroller.demandePartitipantEvenement);
//invitees evenemenet pro
router.patch('/invit-pro/:id',evenementcontroller.InvitationnEvenementPro);
//liste inscrites evenement
//liste participants invites
router.get('/pro/invites/:id',evenementcontroller.getListParticipantInvites);
//liste participants requetes
router.get('/pro/requetes/:id',evenementcontroller.getListParticipantRequetes);
//liste participants inscrits
router.get('/pro/inscrits/:id',evenementcontroller.getListParticipantInscrits);
//get all nombre participant invites && requestes && inscrits
router.get('/participant/:id',evenementcontroller.getAllNombreParticipant);
//les invites de vos contacts et hors contacyts
router.get('/inviter/:idevent/:iduser',evenementcontroller.getInviterContactetHorsContact);
module.exports=router;