// @des 		just something
// @route 		/api/v1/login/:id
// @access 		Public
exports.loginIMSUB = (req, res, next) => {
  res.status(200).json({ username: "user" });
};

// @des 		just something
// @route 		/api/v1/register/:id
// @access 		Public
exports.registerIMSUB = (req, res, next) => {
  res.status(200).json({ success: `Successfully registered ${req.params.id}` });
};

