import {withSessionRoute} from "pages/lib/config/withSession";
import users from "helpers/users-data";

export default withSessionRoute(getusersdata);

function getusersdata(req, res){
  if(req.method = "GET"){
    if(req.session && req.session.user){
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
      return res.send(401);
    }
  } else {
    return res.send(405);
  }
}