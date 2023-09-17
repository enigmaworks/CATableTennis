import {withSessionRoute} from "pages/lib/config/withSession";
import { users } from "helpers/users-data";
const bcrypt = require ('bcrypt');

export default withSessionRoute(createSessionRoute);

async function createSessionRoute(req, res){
  if(req.method === "POST"){
    const {username, password} = req.body;
    let user = users.findUser(username.toString());

    if( user ){
      bcrypt.compare(password.toString(), user.password, async function(err, result) {
        if (result) {
          req.session.user = {
            username: user.username,
            id: user.id,
            permissions: user.permissions,
            firstname: user.info.firstname,
            lastname: user.info.lastname,
          };
          await req.session.save();
          res.status(200).send("");
        }
        if(err){
          return res.status(403).send("");
        }
      });
    } else{
      return res.status(403).send("");
    }
  } else {
    return res.status(404).send("");
  }
}