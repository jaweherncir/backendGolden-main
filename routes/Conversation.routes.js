const router=require('express').Router();
const ConversationController=require('../controller/Conversation.controller');
//new converstaion
router.post('/new_conversation',ConversationController.newConversation)
//get Conversation for one user
router.get('/one_conversation/:userId',ConversationController.oneConversation);
//delet converstation
router.delete('/delet_conversation/:id',ConversationController.deletConversation)
//router.patch('/delet_allmessage_conversation/:id',ConversationController.deletAllMessageConversation)
module.exports=router;