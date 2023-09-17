import {withSessionRoute} from "pages/lib/config/withSession";
import { users } from "helpers/users-data";

export default withSessionRoute(createSessionRoute);

async function createSessionRoute(req, res){
  if(req.method === "POST"){
    const {username, password} = req.body;
    const user = users.findUser(username.toString())

    if( user && password.toString() === user.password.toString()){
      req.session.user = {
        username: user.username,
        id: user.id,
        firstname: user.info.firstname,
        lastname: user.info.lastname,
      };

      await req.session.save();
      return res.send({ok:true});
    }

    return res.status(403).send("");
  }

  return res.status(404).send("");
}