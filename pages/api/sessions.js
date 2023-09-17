import {withSessionRoute} from "pages/lib/config/withSession";
import { users } from "helpers/users-data";
const bcrypt = require ('bcrypt');

export default withSessionRoute(createSessionRoute);

async function createSessionRoute(req, res){
  if(req.method === "POST"){
    const {username, password} = req.body;
    let user = users.findUser(username.toString());
    
    if(user !== undefined) {
      bcrypt.compare(password.toString(), user.password, async function (err, result) {
        if(result === true) {
          req.session.user = {
            username: user.username,
            id: user.id,
            permissions: user.permissions,
            firstname: user.info.firstname,
            lastname: user.info.lastname,
          };
          
          await req.session.save();
          res.status(200).send("");
        } else if (err) {
          res.status(500).send("");
        } else if (result === false) {
          res.status(401).send("");
        }
      });
    } else { return res.status(401).send(""); }
  } else { return res.status(405).send(""); }
}