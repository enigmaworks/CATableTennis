import {withSessionRoute} from "/helpers/withIronSession";
import pg from 'pg';

export default withSessionRoute(site);

async function site(req, res){
  if(req.method === "GET"){
    if(req.session) {
      let columns = [];
      let requestedColumns = Object.keys(req.query);
      
      function checkParam(param){
        if(requestedColumns.includes(param) && req.query[param]) return true;
        return false;
      }
  
      if(checkParam("about_text")) columns.push("about_text");
      if(checkParam("google_calendar_link")) columns.push("google_calendar_link");
      if(checkParam("leaderboard_players")) columns.push("leaderboard_players");
      if(checkParam("last_leaderboard_update")) columns.push("last_leaderboard_update");
      if(checkParam("leaderboard_update_frequency")) columns.push("leaderboard_update_frequency");
      
      columns = columns.join(", ");

      try{
        const pool = new pg.Pool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          database: process.env.DB_DATABASE,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT,
        });

        let {rows} = await pool.query(`SELECT ${columns} FROM site_info;`);
        await pool.end();
        return res.json(rows[0]);

      } catch (err){
        console.log(err);
        return res.status(500).send([]);
      }
    } else {
      return res.status(401).send();
    }
  } else if (req.method === "POST"){
    try{
        const pool = new pg.Pool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          database: process.env.DB_DATABASE,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT,
        });
        
        const updated_column = Object.keys(req.body);
        const dataColumns = ["about_text", "google_calendar_link", "last_leaderboard_update"];

        for(let i = 0; i < updated_column.length; i++){
          if(dataColumns.includes(updated_column[i])){
            await pool.query(`UPDATE site_info SET ${updated_column[i]} = '${req.body[updated_column[i]]}';`);
          }
        }

        if(updated_column.includes("leaderboard_update_frequency")){
          await pool.query(`UPDATE site_info SET leaderboard_update_frequency = ${req.body.leaderboard_update_frequency};`);
        }
        if(updated_column.includes("leaderboard_players")){
          await pool.query(`UPDATE site_info SET leaderboard_players = ${req.body.leaderboard_players};`);
        }

        await pool.end();
        return res.status(200).send();
      } catch (err) {
        console.log(err)
        return res.status(500).send();
      }
  } else {
    return res.status(405).send({});
  }
}