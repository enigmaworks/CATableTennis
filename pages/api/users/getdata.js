import users from "helpers/users-data";

export default function getusersdata(req, res){
  if(req.method = "GET"){
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
    return res.status(405).send([]);
  }
}