const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get("hotst")}.${req.originalUrl}`
  );
  next();
};

module.exports = logger
