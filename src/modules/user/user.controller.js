import userManager from "./user.manager.js";

export default class UserController {
  async signUp(req, res) {
    try {
      const { name, email, password, username, signupMethod, displayName } =
        req.body;
      const result = await new userManager().signUp({
        name,
        email,
        password,
        username,
        signupMethod,
        displayName,
      });
      if (result.success == false) {
        res.status(500).send(result);
      } else {
        res.status(201).send(result);
      }
    } catch (error) {
      console.log("Controller Error", error);
      res.status(500).send(error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await new userManager().login({ email, password });
      if (result == false) {
        res.status(500).send(result);
      } else {
        res.status(201).send(result);
      }
    } catch (error) {
      console.log("Controller Error", error);
      res.status(500).send(error);
    }
  }

  async changePassword(req, res) {
    try {
      const { userId, newPassword } = req.body;
      const result = await new userManager().changePassword({
        userId,
        newPassword,
      });
      if (result == false) {
        res.status(500).send(result);
      } else {
        res.status(201).send(result);
      }
    } catch (error) {
      console.log("Controller Error", error);
      res.status(500).send(error);
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await new userManager().forgotPassword({ email });
      if (result == false) {
        res.status(500).send(result);
      } else {
        res.status(201).send(result);
      }
    } catch (error) {
      console.log("Controller Error", error);
      res.status(500).send(error);
    }
  }

  async passwordlessLogin(req, res) {
    try {
      const { phoneNumber } = req.body;
      const result = await new userManager().passwordlessLogin({ phoneNumber });
      if (result == false) {
        res.status(500).send(result);
      } else {
        res.status(201).send(result);
      }
    } catch (error) {
      console.log("Controller Error", error);
      res.status(500).send(error);
    }
  }

  async passwordlessVerify(req, res) {
    try {
      const { phoneNumber, code } = req.body;
      const result = await new userManager().passwordlessVerify({
        phoneNumber,
        code,
      });
      if (result == false) {
        res.status(500).send(result);
      } else {
        res.status(201).send(result);
      }
    } catch (error) {
      console.log("Controller Error", error);
      res.status(500).send(error);
    }
  }

  // Assignment API

  async callback(req, res) {
    try {
      const result = await new userManager().callback(req);
      if (result == false) {
        res.status(500).send(result);
      } else {
        res.status(201).send(result);
      }
    } catch (error) {
      console.log("Controller Error", error);
      res.status(500).send(error);
    }
  }
}
