const router = require("express").Router();
const postController = require("../controller/post.controller");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "client/public/uploads/posts");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

//router.post('/',postController.createPost);

//getAllPub
router.get('/',postController.readPost);
//get post by user
router.get('/user/:id',postController.GetPOstBYUSER);
router.get('/:id',postController.GetPostByID);

//AddPub
router.post('/newPost',upload.single("images"),postController.createPost);
//update Pub
router.put('/:id',postController.updatePost);
//Delet pub
router.delete('/:id',postController.deletePost);
//like des post
router.put('/like-post/:id',postController.likePost);
router.put('/unlike-post/:id',postController.unlikePost);
//commenter publication
router.put('/commente-post/:id',postController.commentPost);
router.put('/edit-commente-post/:id',postController.editCommentPost);
router.put('/delete-commente-post/:id',postController.SupprimerCommentPost);
router.put('/like-commanet/:id',postController.likeComment);

router.patch('/unlike-commanet/:id',postController.unlikeComment);
//repand comment
router.patch('/Repand_Comment/:id',postController.repand);
router.patch('/update_Repand_Comment/:id',postController.editRepant);
router.patch('/delete_Repand_Comment/:id',postController.deletRepant);
router.patch('/like_Repand_Comment/:id',postController.LikeRepant);
router.patch('/unlike-Repand/:id',postController.unlikeRepand);
//nbr like of repand
router.get('/nbr_likes_repand/:id',postController.getCountlikersRepand);
//count nmbr like
router.get('/nbr_likes_post/:id',postController.getlikers);
//count nmber comment
router.get('/nbr_comment_post/:id',postController.getCountComment);
router.get('/nbr_like_comment/:id',postController.getCountLikeComment);
//share post
router.put('/share_post/:id',postController.sharePost);
//tag amis
router.patch('/tag_post_ami/:id',postController.tagAmi);

//coupcoeur
router.patch('/accept-coupcoueur/:id',postController.AccesToPostPrive);
router.get('/allpostpublic',postController.getALlPostPublic);
router.get('/allpostprivate',postController.getALlPostPrive)
router.get('/allpost',postController.getAllPOst)
router.get('/jour',postController.getCountPostPArJour)
router.get('/semaine',postController.getCountPostPArSemaine)
router.get('/mois',postController.getCountPostParMois)
router.get('/trimestre',postController.getCountPostParTrimestre)
router.get('/years',postController.getCountPostParYears)



module.exports=router;