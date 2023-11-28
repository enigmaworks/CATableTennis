import {withSessionRoute} from "helpers/withIronSession";
import users from "helpers/users-data";

export default withSessionRoute(getusersdata);

function getusersdata(req, res){
  if(req.method = "POST"){
    const {id, data} = req.body;

    if(req.session && req.session.user){
      try{
        users.updateUser(id, data);
        return res.status(200).send();
      } catch {
        return res.status(500).send();
      }
    } else {
      return res.status(401).send();
    }
  } else {
    return res.status(405).send();
  }
}