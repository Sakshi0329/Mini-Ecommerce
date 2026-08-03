const admin = (req, res, next) => {
  console.log("Checking Admin:", req.user.email);
  console.log("Role:", req.user.role);

  if (req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    msg: "Access Denied: Admin only!",
  });
};

export default admin;
