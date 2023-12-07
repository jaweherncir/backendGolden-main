const router=require("express").Router();
const PageproController= require("../controller/pagepro.controller");
const  multer = require("multer");
const storagebaniere = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "client/pagepro/baniere");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const storageavatar = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "client/pagepro/avatar");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const uploadbanier = multer({ storage: storagebaniere });
const uploadavatar = multer({ storage: storageavatar });

router.post('/newpagepro',PageproController.createPagePro);
router.put('/informations/:id',PageproController.createPageProInformations);
router.put('/banniere/:id',uploadbanier.single('banniere'),PageproController.createPageProPhotoBaniere);
router.put('/avatar/:id',uploadavatar.single('avatar'),PageproController.createPageProPhotoAvatar);

router.get('/all',PageproController.getAllPagePRo);
router.get('/:id',PageproController.getPagePRoByid);

router.delete('/:id',PageproController.deletePagePro);
module.exports=router;