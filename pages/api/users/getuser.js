import {withSessionRoute} from "/helpers/withIronSession";
import pg from 'pg';

export default withSessionRoute(getall);


async function getall(req, res){
  if(req.method = "GET"){
    if(req.query.id === undefined){
      return res.status(500).send([]);
    }

    let columns = [];
    let requestedColumns = Object.keys(req.query);


    function checkParam(param){
      if(requestedColumns.includes(param) && req.query[param]) return true;
      return false;
    }

    if(checkParam("permissions")){
      if (req.session && req.session.user && req.session.user.permissions >= 1) {
        columns.push("permissions");
      } else {
        return res.status(401).send([]);
      }
    }

    if(checkParam("username")){
      if (req.session && req.session.user && req.session.user.permissions >= 1) {
        columns.push("username");
      } else {
        return res.status(401).send([]);
      }
    }

    if(checkParam("id")) columns.push("id");
    if(checkParam("date_created")) columns.push("date_created");
    if(checkParam("date_updated")) columns.push("date_updated");
    if(checkParam("date_stats_updated")) columns.push("date_stats_updated");
    if(checkParam("info_first_name")) columns.push("info_first_name");
    if(checkParam("info_last_name")) columns.push("info_last_name");
    if(checkParam("info_graduation")) columns.push("info_graduation");
    if(checkParam("info_flair")) columns.push("info_flair");
    if(checkParam("stats_w")) columns.push("stats_w");
    if(checkParam("stats_l")) columns.push("stats_l");
    if(checkParam("stats_elo")) columns.push("stats_elo");
    if(checkParam("stats_rank")) columns.push("stats_rank");
    
    columns = columns.join(", ");

    try{

      const pool = new pg.Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      });
     
      let {rows} = await pool.query(`SELECT ${columns} FROM users WHERE id = ${parseInt(req.query.id)};`);

      await pool.end();
      return res.json(rows[0]);
    } catch (err){
      console.log(err);
      return res.status(500).send([]);
    }
  } else {
    return res.status(405).send([]);
  }
}