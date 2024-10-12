import {withSessionRoute} from "/helpers/withIronSession";
const users = require("/helpers/userDataFunctions");

export default withSessionRoute(_delete);

function _delete(req, res){
  if(req.method = "POST"){
    const {id} = req.body;
    if(!users.findUserById(id)) return res.status(400).send();
    
    if(req.session && req.session.user && req.session.user.permissions === 1) {
      users.deleteUser(id);
      return res.status(200).send();
    } else {
      return res.status(401).send();
    }
  }
  return res.status(405).send();
}