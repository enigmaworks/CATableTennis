import {withSessionRoute} from "helpers/lib/config/withSession";
import users from "helpers/users-data";

export default withSessionRoute(create);

function create(req, res){
  if(req.method = "POST"){
    const {username, password, permissions, userinfo} = req.body;
    if(users.findUser(username)) return res.status(400).send();

    if(req.session && req.session.user) {
      if(req.session.user.permissions === 1){
        createUser(username, password, permissions, userinfo);
      } else {
        createUser(username, password, 0, userinfo);
      }
      return res.status(200).send();
    } else {
      return res.status(401).send();
    }
  }
  return res.status(405).send();
}

function createUser(username, password, permissions, userinfo){
  users.createUser(username.toString(), password.toString(), permissions, userinfo);
}
