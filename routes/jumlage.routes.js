const router = require("express").Router();
const jumlageController = require("../controller/jumlage.controller");
 

//accept jumlage (ce tratiement sera effectue dans notificationController)
//createJumlage(acccept jumlage and supprimer notification and invitation)
router.post('/user-duo/:useracceptjum',jumlageController.createJumlage);


//suprimer compte duo
router.delete('/:id',jumlageController.DeleteUserDuo);
router.get('/:id',jumlageController.getJumlageByID);
router.get('/countjum',jumlageController.getAllCompteDuo);
module.exports=router;
