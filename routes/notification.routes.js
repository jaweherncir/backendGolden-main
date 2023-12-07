const router = require('express').Router();
const notificationController = require('../controller/notification.controller');

router.get('/interaction/:id',notificationController.GetNotificationContactByUSer);
router.get('/message/:id',notificationController.GetNotificationMessagetByUSer);
router.get('/event/:id',notificationController.GetNotificationEventByUSer);
router.get('/coueur/:id',notificationController.GetNotificationQueuretByUSer);
router.get('/interaction/:id/:idnotif',notificationController.GetNotificationIneratctiontByUSerandidnotif);
router.get('/coueur/:id/:idnotif',notificationController.GetNotificationCoueurByUSerandidnotif);
router.get('/message/:id/:idnotif',notificationController.GetNotificationMessageByUSerandidnotif);


module.exports=router;