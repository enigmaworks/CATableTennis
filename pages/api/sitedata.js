import {withSessionRoute} from "helpers/lib/config/withSession";
import * as fs from "fs";
let sitedata = require("/data/site.json");

export default withSessionRoute(site);

function site(req, res){
  if(req.method === "POST"){
    if(req.session && req.session.user && req.session.user.permissions === 1) {
      const {calendarlink, about, numplayersonleaderboard} = req.body;
      if(calendarlink){
        sitedata.calendarlink = calendarlink;
      }
      if(about){
        sitedata.about = about;
      }
      if(numplayersonleaderboard){
        sitedata.numplayersonleaderboard = parseInt(numplayersonleaderboard);
      }
      fs.writeFileSync('data/site.json', JSON.stringify(sitedata, null, 4));
      return res.status(200).send();
    } else {
      return res.status(401).send();
    }
  } else if (req.method === "GET"){
    return res.json(sitedata);
  } else {
    return res.status(405).send({});
  }
}