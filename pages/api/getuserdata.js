import {withSessionRoute} from "pages/lib/config/withSession";
import users from "helpers/users-data";

export default withSessionRoute(getusersdata);

function getusersdata(req, res){
  if(req.method = "GET"){
    let usersData = users.getAll();
    usersData = usersData.map(user => {
      return {
        id: user.id,
        lastStatUpdate: user.lastStatUpdate,
        username: user.username,
        permissions: user.permissions,
        info: user.info,
        statistics: user.statistics,
      }
    })
    return res.json({data: usersData});
  } else {
    return res.send(405);
  }
}