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
  if (await req.body.length > 0) {
    return req.body;
  }
  await req.user
  ? res.status(200).json(req.user)
  : res.status(404).json(req.message);

  next();
}

async function validateUser(req, res, next) {
  await req.body
  ? res.status(200).json(req.body)
  : res.status(400).json(req.message)

  next();
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
}

// do not forget to expose these functions to other modules
