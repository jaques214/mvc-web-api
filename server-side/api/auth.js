export function requireAuth(req, res, next){
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
}

export function checkPermissionLevel(level){
  return function(req, res, next){
    if (req.user && req.user.permissions >= level) {
      next();
    } else {
      res.sendStatus(403);
    }
  };
}