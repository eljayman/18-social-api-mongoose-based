const router = require('express').Router();
const apiRoutes = require('./api');

// api routes handler
router.use('/api', apiRoutes);

// catch all other requests
router.use('*', (req, res) => {
  return res.send('Wrong route!');
});

module.exports = router;
