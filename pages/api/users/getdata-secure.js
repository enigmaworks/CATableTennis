import {withSessionRoute} from "helpers/withIronSession";
const users = require("helpers/userDataFunctions");

export default withSessionRoute(getDataSecure);

function getDataSecure(req, res){
  if(req.method = "GET"){
    if(req.session && req.session.user && req.session.user.permissions === 1){
      let usersdata = users.getAll();
      usersdata = usersdata.map(user => {
        return {
          id: user.id,
          lastStatUpdate: user.lastStatUpdate,
          username: user.username,
          permissions: user.permissions,
          info: user.info,
          statistics: user.statistics,
        }
      })
      return res.json(usersdata);
    } else {
      return res.status(401).send([]);
    }
  } else {
    return res.status(405).send([]);
  }
}