declare global {
  namespace Express {
    interface Request {
      user?: {
        _id?: string;
        username?: string;
        role?: unknown;
        permissions?: number;
      };
    }
  }
}

export {};
