const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

// Middleware for overriding methods
const methodOverride = require('method-override');
router.use(methodOverride('_method'));

router.get('/',indexController.getListProduct);

module.exports = router;