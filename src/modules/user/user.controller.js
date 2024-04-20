import userManager from "./user.manager.js";

export default class UserController {
    async signUp(req, res) {
        try {
            const { name, email, password, username, signupMethod, displayName } = req.body;
            const result = await new userManager().signUp({ name, email, password, username, signupMethod, displayName});
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
            const result = await new userManager().login({ email, password});
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