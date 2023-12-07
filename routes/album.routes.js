const router=require("express").Router();
const AlbumController=require("../controller/album.controller");
const  multer = require("multer");
const userController = require("../controller/user.controller");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "client/public/uploads/album");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

router.get('/:id',AlbumController.getAllAlbumByID);
router.get('/allphotoprofile/:id',AlbumController.getAlbumProfileByUSerID);
router.get('/allphotocouvertir/:id',AlbumController.getAlbumCouvertureByUSerID);
router.get('/photoprofile/:id/:iduser',AlbumController.getPhotoProfileFromAlbumByUserId);
router.get('/photocouvertir/:id/:iduser',AlbumController.getPhotoCouvertirFromAlbumByUserId);
router.post("/upload-photo/:id",upload.single('photo'),AlbumController.AddPhotoAlbum)
router.put("/privatiser/:id",AlbumController.PrivialiserPhotoFromALbum)
router.delete("/:id",AlbumController.DeletePhotoFromAlbum)
router.patch("/accept-acces/:id",AlbumController.accepAccesAlbum)


module.exports=router;