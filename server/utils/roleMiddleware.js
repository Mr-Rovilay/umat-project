// middleware/roleMiddleware.js
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
// This middleware checks if the user's role is included in the allowed roles
// If not, it sends a 403 Forbidden response