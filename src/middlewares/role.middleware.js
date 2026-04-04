export const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "you are not authorized to perform this action" });
    }
    next();
  };
};