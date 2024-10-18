import {withSessionRoute} from "/helpers/withIronSession";
import pg from 'pg';

export default withSessionRoute(getall);

async function getall(req, res){
  if(req.method = "GET"){
    let columns = [];
    let requestedColumns = Object.keys(req.query);
    let modifier = req.query.modifier || "none";
    let sort_column = req.query.sort_column || "none";
    let sort_descending = req.query.sort_descending;
    let sort_column_2 = req.query.sort_column2 || "none";
    let sort_2_descending = req.query.sort_descending;

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

      let query = `SELECT ${columns} FROM users`;

      if(modifier === "current" || modifier === "graduated"){
        let thisyear = new Date().getFullYear();
        let nextyear = thisyear + 1;
        
        let thisYearsGraduation = "July 1 ";
        if(new Date().getMonth() > 6){ 
          thisYearsGraduation += nextyear;
        } else {
          thisYearsGraduation += thisyear;
        }
        
        if(modifier === "current"){
          query += ` WHERE info_graduation >= '${thisYearsGraduation}'::date`;
        } else {
          query += ` WHERE info_graduation < '${thisYearsGraduation}'::date`;
        }
      }

      if(sort_column === "date_created") query += " ORDER BY date_created";
      if(sort_column === "date_updated") query += " ORDER BY date_updated";
      if(sort_column === "date_stats_updated") query += " ORDER BY date_stats_updated";
      if(sort_column === "info_first_name") query += " ORDER BY info_first_name";
      if(sort_column === "info_last_name") query += " ORDER BY info_last_name";
      if(sort_column === "info_graduation") query += " ORDER BY info_graduation";
      if(sort_column === "stats_w") query += " ORDER BY stats_w";
      if(sort_column === "stats_l") query += " ORDER BY stats_l";
      if(sort_column === "stats_elo") query += " ORDER BY stats_elo";
      if(sort_column === "stats_rank") query += " ORDER BY stats_rank";
      if(sort_descending) query += " DESC";

      if(sort_column_2 === "date_created") query += ", date_created";
      if(sort_column_2 === "date_updated") query += ", date_updated";
      if(sort_column_2 === "date_stats_updated") query += ", date_stats_updated";
      if(sort_column_2 === "info_first_name") query += ", info_first_name";
      if(sort_column_2 === "info_last_name") query += ", info_last_name";
      if(sort_column_2 === "info_graduation") query += ", info_graduation";
      if(sort_column_2 === "stats_w") query += ", stats_w";
      if(sort_column_2 === "stats_l") query += ", stats_l";
      if(sort_column_2 === "stats_elo") query += ", stats_elo";
      if(sort_column_2 === "stats_rank") query += ", stats_rank";
      if(sort_2_descending) query += " DESC";

      query += ";";
      let rows = [];
      await pool.query(query).then(data => rows = data.rows);
      await pool.end();
      return res.json(rows);

    } catch (err){
      console.log(err);
      return res.status(500).send([]);
    }
  } else {
    return res.status(405).send([]);
  }
}