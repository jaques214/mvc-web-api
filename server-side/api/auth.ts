import type { NextFunction, Request, Response } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
}

export function checkPermissionLevel(level: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user && (req.user.permissions ?? 0) >= level) {
      next();
    } else {
      res.sendStatus(403);
    }
  };
}