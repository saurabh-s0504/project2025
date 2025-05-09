const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const auth = require('../middlewares/auth');
const fileUpload = require('../middlewares/fileUpload');

// Public routes
router.post('/pdf-to-jpg', fileUpload.single('file'), pdfController.pdfToJpg);
router.post('/merge-pdf', fileUpload.array('files', 10), pdfController.mergePdf);

// Protected routes
router.post('/unlock-pdf', auth, fileUpload.single('file'), pdfController.unlockPdf);
router.post('/protect-pdf', auth, fileUpload.single('file'), pdfController.protectPdf);

module.exports = router;