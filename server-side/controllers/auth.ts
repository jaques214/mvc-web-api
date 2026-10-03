import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import express, { type NextFunction, type Request, type Response } from 'express';
import config from '../jwt_secret/config';
import User from '../models/users';
import rateLimitMiddleware from '../utils/rateLimit';

type AuthUser = {
  _id?: string;
  username?: string;
  role?: unknown;
  permissions?: number;
};

const authController = express();

class AuthController {
  async register(req: Request, res: Response) {
    const { username, password } = req.body;
    if (username === "") {
      res.sendStatus(400);
      return;
    }

    try {
      const existingUser = await User.findOne({ $eq: { username } });

      if (existingUser) {
        res.status(400).send('That User is already registered!');
        return;
      }

      const hashedPassword = bcrypt.hashSync(password ?? '', 8);
      const createdUser = await User.create({
        username,
        password: hashedPassword,
        role: {
          value: 'Client',
        },
      });

      const { password: _unusedPassword, ...safeUser } = createdUser.toObject();
      const token = jwt.sign(
        {
          user: { _id: createdUser._id, username: createdUser.username, role: createdUser.role },
        },
        config.secret,
        {
          expiresIn: 86400,
        },
      );

      res.status(200).json({ ...safeUser, token });
    } catch (err) {
      res.status(500).send('Error on the server.');
    }
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body as { username?: string; password?: string };
    try {
      if (typeof username !== 'string') {
        res.status(400).json({ status: 'error' });
        return;
      }

      const user = await User.findOne({ username });
      const errorMessage = 'Incorrect Username or Password!';
      if (!user) return res.status(401).send(errorMessage);

      const passwordIsValid = bcrypt.compareSync(password ?? '', user.password);
      if (!passwordIsValid) return res.status(401).send(errorMessage);

      const { password: _unusedPassword, ...safeUser } = user.toObject();
      const token = jwt.sign(
        { user: { _id: user._id, username: user.username, role: user.role } },
        config.secret,
        {
          expiresIn: 86400,
        },
      );

      res.status(200).json({ ...safeUser, token });
    } catch (err) {
      res.status(500).send('Error on the server.');
    }
  }

  logout(req: Request, res: Response) {
    res.status(200).send({});
  }

  verifySession(req: Request, res: Response, next: NextFunction) {
    const token = req.header('x-access-token');
    if (!token) {
      next();
      return;
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err || typeof decoded !== 'object' || decoded === null) {
        next();
        return;
      }

      const user = decoded.user as AuthUser | undefined;
      req.user = user;
      next();
    });
  }
}

export const auth = new AuthController();
authController.post("/register", auth.register);
authController.post("/login", rateLimitMiddleware, auth.login);
authController.get("/logout", rateLimitMiddleware, auth.logout);
export default authController;
