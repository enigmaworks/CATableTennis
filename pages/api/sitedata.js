import {withSessionRoute} from "helpers/lib/config/withSession";
import * as fs from "fs";
let sitedata = require("/data/sitedata.json");

export default withSessionRoute(editsite);

function editsite(req, res){
  if(req.session && req.session.user && req.session.user.permissions === 1) {
    if(req.method = "POST"){
      const {calendarlink, about} = req.body;
      if(calendarlink){
        sitedata.calendarlink = calendarlink;
      }
      if(about){
        sitedata.about = about;
      }
      fs.writeFileSync('data/sitedata.json', JSON.stringify(data, null, 4));
      return res.status(200).send();
    } else if (req.method = "GET"){
      return res.json(sitedata);
    } else {
      return res.status(405).send();
    }
  } else {
    return res.status(401).send();
  }
}