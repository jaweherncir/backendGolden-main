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
router.get('/:userId',AlbumController.getAllAlbumByIDUser);
router.post("/upload-photo/:id",upload.single('photo'),AlbumController.AddPhotoAlbum)
 
router.delete("/deletPhotoFromAlbum/:id", AlbumController.DeletePhotoFromAlbum);
router.get("/getPrivateImage/:userId", AlbumController.getPrivateImage);
router.get("/getPublicImage/:userId", AlbumController.getPublicImage);
//changer visublité of image 
router.put("/:albumId/photos/:photoId/visibility", AlbumController.change);
//changer visublité of album
router.put("/:albumId/visibility", AlbumController.changeVisibiltyAlbum);

router.get('/:id',AlbumController.getAllAlbumByID);
router.get('/allphotoprofile/:id',AlbumController.getAlbumProfileByUSerID);
router.get('/allphotocouvertir/:id',AlbumController.getAlbumCouvertureByUSerID);
router.get('/photoprofile/:id/:iduser',AlbumController.getPhotoProfileFromAlbumByUserId);
router.get('/photocouvertir/:id/:iduser',AlbumController.getPhotoCouvertirFromAlbumByUserId);

router.put("/privatiser/:id",AlbumController.PrivialiserPhotoFromALbum)
 
router.patch("/accept-acces/:id",AlbumController.accepAccesAlbum)
 

module.exports=router; 