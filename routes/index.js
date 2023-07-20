const router = require('express').Router();
const mapRoutes = require('./map');

router.use('/map', mapRoutes);


// starting route
router.get('/', (req, res) => {
    res.send('Welcome 👋');
}); 

module.exports = router; 