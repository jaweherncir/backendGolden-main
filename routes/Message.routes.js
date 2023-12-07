const router=require('express').Router();
const Message=require("../controller/Message.controller")
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

/*const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), "client/public/uploads/chatMessage"));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.toLowerCase().split(' ').join('-'));
    },
});*/
/*const imageUpload = multer({

    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|mp4|MPEG-4|mkv|jpeg)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
})*/
//const upload = multer({ storage: storage });
const messagephoto = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "client/public/uploads/chatMessage");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const uploadmessagephoto = multer({ storage: messagephoto });

router.post('/new-message',uploadmessagephoto.single("messageImage"),Message.newMessage)
//router.put('/add-message/:id',upload.array("messageImage"),Message.addmessage)
//get all message of one conversation
router.get('/allmessage-conversation/:conversationId',Message.allMessageConversation)
router.get('/allmessage/:id',Message.allMessageByuserID)
//get all imag of conversation
router.get('/allImageMessage/:id',Message.allImageMessage)
router.get('/jour',Message.getCountMessagePArJour)
router.get('/semaine',Message.getCountMessagePArSemaine)
router.get('/mois',Message.getCountMessageParMois)
router.get('/trimestre',Message.getCountMessageParTrimestre)
router.get('/years',Message.getCountMessageParYears)



router.delete('/delet_message/:id',Message.deleteMessage)
module.exports=router;