const router = require('express').Router();
const userRoutes = require('./users');
const thoughtRoutes = require('./thoughts');

// api routes for users and thoughts
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

// catch all invalid /api requests
router.use('*', (req, res) => {
  return res.send('Wrong route!');
});

module.exports = router;
