import {withSessionRoute} from "pages/lib/config/withSession";
import users from "helpers/users-data";

export default withSessionRoute(create);

function create(req, res){
  if(req.method = "POST"){
    const {username, password, permissions, userinfo} = req.body;
    if(users.findUser(username)) return res.send(400);

    if(req.session && req.session.user.permisions === 1){
      createUser(username, password, permissions, userinfo);
    } else {
      createUser(username, password, 0, userinfo);
    }

    return res.send(200);
  }
  return res.send(405)
}

function createUser(username, password, permisions, userinfo){
  users.createUser(username.toString(), password.toString(), permisions, userinfo);
}
