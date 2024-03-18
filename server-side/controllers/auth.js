import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../jwt_secret/config.js";
import User from "../models/users.js";
import express from "express";
const authController = express.Router();
class AuthController {

  register(req, res) {
    const { username, password } = req.body;
    if (username === "") {
      res.sendStatus(400);
      return;
    }

    User.findOne({$eq: {username}}, function (err, user) {
      if (user) {
        res.status(400).send("That User is already registered!");
        return;
      }

      const hashedPassword = bcrypt.hashSync(password, 8);
      User.create(
        {
          username,
          password: hashedPassword,
          role: {
            value:'Client',
          }
        },
        function (err, user) {
          if (err) {
            return res
              .status(500)
              .send("There was a problem registering the user`.");
          }

          // if user is registered without errors
          // create a token
          const token = jwt.sign({ user }, config.secret, {
            expiresIn: 86400, // expires in 24 hours
          });

          res.status(200).json({ ...user.toObject(), token });
        }
      );
    });
  }

  login(req, res) {
    const { username, password } = req.body;
    User.findOne({ $eq: { username }}, function (err, user) {
      if (err) return res.status(500).send("Error on the server.");
      const errorMessage = "Incorrect Username or Password!";
      if (!user) return res.status(401).send(errorMessage);
      // check if the password is valid
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) return res.status(401).send(errorMessage);
      // if user is found and password is valid
      // create a token
      const token = jwt.sign({ user }, config.secret, {
        expiresIn: 86400, // expires in 24 hours
      });
      // return the information including token as JSON
      res.status(200).json({ ...user.toObject(), token });
    });
  }

  logout(req, res) {
    res.status(200).send({});
  }

  verifySession(req, res, next) {
    const token = req.header("x-access-token");
    if (!token) {
      next();
      return;
    }
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        next();
        return;
      }

      req.user = decoded.user;
      next();
    });
  }
}

export const auth = new AuthController();
authController.post("/register", auth.register);
authController.post("/login", auth.login);
authController.get("/logout", auth.logout);
export default authController;
