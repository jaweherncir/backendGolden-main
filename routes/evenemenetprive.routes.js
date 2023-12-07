const router= require("express").Router();
const evenementprive=require("../controller/evenementprive.controller");
const  multer = require("multer");
const evenementcontroller = require("../controller/evenement.controller");
const storagebaniere = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "client/event/prive");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const uploadbanier = multer({ storage: storagebaniere });
router.post('/',evenementprive.createEvenementPrive);
router.put('/sansprevente/:id',evenementprive.createEvenementPriveSansPrivente);
router.put('/avecprevente/:id',evenementprive.createEvenementPriveAvecPrivente);
router.put('/nom/:id',evenementprive.createEvenementPriveNom);
router.put('/banniere/:id',uploadbanier.single('banniere'),evenementprive.createEvenementPrivePhotoBaniere);
router.put('/lieu/:id',evenementprive.createEvenementPriveLieux);
router.put('/datedebut/:id',evenementprive.createEvenementPriveDateDebut);
router.put('/datefin/:id',evenementprive.createEvenementPriveDateFin);
router.put('/langues/:id',evenementprive.createEvenementPriveParticipantLanguageParle);
router.put('/genre/:id',evenementprive.createEvenementPriveParticipantGenreConcernnes);
router.put('/sexualite/:id',evenementprive.createEvenementPriveParticipantSexualiteConcernnes);
router.put('/typedesoire/categories/:id',evenementprive.createEvenementPriveTypeDeSoireeAddCategorie);
router.put('/typedesoire/musique/:id',evenementprive.createEvenementPriveTypeDeSoireeAddAmianceMusicales);
router.put('/typedesoire/description/:id',evenementprive.createEvenementPriveTypeDeSoireeAddDescripition);
router.put('/typedesoire/dresscode/:id',evenementprive.createEvenementPriveTypeDeSoireeAddDressCode);
router.put('/parametres/:id',evenementprive.createEvenementPriveParametres);
router.put('/prevent/parametres/:id',evenementprive.createEvenementPriveAvecPreventeParametres);
router.put('/parametres/autorisation/:id',evenementprive.createEvenementPriveParametresChoisirRole);
router.put('/avantage/:id',evenementprive.createEvenementPriveAvecPreventeAvantage);
router.put('/avantage/update/:idevent/:idavantage',evenementprive.createEvenementPriveAvecPreventeUpdateAvantage);
router.delete('/avantage/delete/:idevent/:idavantage',evenementprive.createEvenementPriveAvecPreventeDeleteAvantage);
router.put('/fin/:id',evenementprive.createEvenementPrivePubliez);
//prive avec prevenet
router.put('/avecprevente/prix/:id',evenementprive.createEvenementPrivePrixSoloDuo);
router.get('/all',evenementprive.getAllEvenetPrive);
router.get('/:id',evenementprive.getEventPriveByID);
router.delete('/:id',evenementprive.DeleteEventPrive);








module.exports=router;