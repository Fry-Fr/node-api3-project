const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
const Users = require('./users-model');
// The middleware functions also need to be required
const {
  logger,
  validateUserId,
  validateUser
} = require('../middleware/middleware');

const router = express.Router();
router.use(logger);

router.get('/', async (req, res) => {
  Users.get() // RETURN AN ARRAY WITH ALL THE USERS
    .then(users => {
      users
      ? res.status(200).json(users)
      : res.status(404).json({ message: "There are no users." })
    })
    .catch(err => err.status(500).json({ message: "Err happend while getting users." }))
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  await Users.getById(id) // RETURN THE USER OBJECT
    .then(user => {
      user
      ? req.user = user
      : req.message = { message: "user not found" }
    })
    .catch(err => res.status(500).json(err?.message || "something went wrong"))

    next(); // this needs a middleware to verify user id
}, validateUserId);

router.post('/', async (req, res, next) => {
  await Users.insert(req.body) // RETURN THE NEWLY CREATED USER OBJECT
    .then(newUser => {
      req.body = newUser
    })
    .catch(err => res.status(500).json(err?.message || "something went wrong"))

  next(); // this needs a middleware to check that the request body is valid
}, validateUser);

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const username = req.body;

  username.name
  ? await Users.update(id, username)
      .then(updUsr => {
        req.body = updUsr
        req.body.name = updUsr
      })
      .catch(err => res.status(500).json(err?.message || "something went wrong"))
  : next(res.status(400).json({ message: "missing required name field" }));
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
}, validateUserId, validateUser);

router.delete('/:id', (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
});

router.get('/:id/posts', (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
});

router.post('/:id/posts', (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

module.exports = router; // do not forget to export the router
