const router = require("express").Router();
const invitationController= require("../controller/invitation.controller");


//invitation jumlage
router.patch('/invit-jumlage/:id',invitationController.invitationJumlage);
//accepter une invitation de jumlage  api ce trouve dans jumlage .routeres

//refuse linvitation jumlage(delete invit dans la model invitation)
router.patch('/refuse-jumlage/:id',invitationController.refuseDemandeJumlage);
router.patch('/anuller-jumlage/:id',invitationController.AnnulerDemandeJumlage);
router.get('/');
//invitation demande coupcoeur
router.patch('/invit-coupcoueur/:id',invitationController.invitationCoupCoueur);
//invite user
router.patch('/invit-contact/:id',invitationController.InvitationContact);
router.patch('/annuler-contact/:id',invitationController.AnnulerInvitationContact);
router.patch('/refuse-contact/:id',invitationController.RefuseInvitationContact);
router.patch('/invit-album/:id',invitationController.InvitationAlbum);





module.exports=router; 