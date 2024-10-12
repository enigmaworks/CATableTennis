import {withSessionRoute} from "/helpers/withIronSession";
const users = require("/helpers/userDataFunctions");

export default withSessionRoute(saveMatchResult);

function saveMatchResult(req, res){
  if(req.method = "POST"){
    const {results} = req.body;
    if(req.session && req.session.user && req.session.user.permissions >=1 ){
      try{
        for(let i = 0; i < results.length; i++){
          users.saveMatchResult(results[i].id, results[i].won);
        }
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