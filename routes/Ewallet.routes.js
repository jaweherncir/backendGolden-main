const router=require('express').Router();
const Ewallet=require("../controller/Ewallete.controller")
const multer = require("multer");
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './image');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "--" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')){
        cb(null, true);
    } else{
        cb(null, false);

    }

};
const upload = multer({ storage: storage});
//new Rib generale
router.post('/newRibGenerale',Ewallet.AddRIB)
router.delete('/deleteRibGenerale/:id',Ewallet.deleteRIB)
//rib Pro
router.post('/newRibGeneralePro',Ewallet.AddRIBPro)

module.exports=router;