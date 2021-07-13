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
      req.user = user
      user
      ? res.status(200).json(user)
      : next();
    })
    .catch(err => res.status(500).json(err?.message || "something went wrong"))

    next(); // this needs a middleware to verify user id
}, validateUserId);

router.post('/', validateUser, async (req, res, next) => {
  const newUser = await req.body;

  await Users.insert(newUser)
    .then(newUsr => {
      newUsr
      ? res.status(201).json(newUsr)
      : next()
    })
    .catch(next)
    
  next(); // this needs a middleware to check that the request body is valid
});

router.put('/:id', validateUser, async (req, res, next) => {
  const { id } = req.params;
  const modUser = await req.body;

  await Users.update(id, modUser)
    .then(modUsr => {
      req.user = modUsr
      modUsr
      ? res.status(200).json(modUsr)
      : next();
    })
    .catch(next)
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
}, validateUserId);

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  await Users.getById(id) // RETURN THE FRESHLY DELETED USER OBJECT
    .then(user => {
      req.user = user
      user
      ?res.status(200).json(user) &&
        Users.remove(id)
          .then(rmUsr => {
            rmUsr
            ? rmUsr
            : next();
          })
          .catch(next)
      
      : next();      
    })
    .catch(next)
  next(); // this needs a middleware to verify user id
}, validateUserId);

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
