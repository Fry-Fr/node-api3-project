module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
};

function logger(req, res, next) {
  const date = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;

  console.log(date, method, url);
  next();
}

async function validateUserId(req, res, next) {
  const user = req.user
  if (!user) {
    res.status(404).json({ message: "user not found" })
  }
  next();
}

async function validateUser(req, res, next) {
  if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" })
  }
  next();
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
}

// do not forget to expose these functions to other modules
