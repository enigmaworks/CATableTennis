import {withSessionRoute} from "/helpers/withIronSession";
import pg from 'pg';

export default withSessionRoute(getall);

async function getall(req, res){
  if(req.method = "GET"){
    
    try{
      const pool = new pg.Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      });

      let thisyear = new Date().getFullYear();
      let nextyear = thisyear + 1;
      let thisYearsGraduation = "July 1 ";
      if(new Date().getMonth() > 6){ 
        thisYearsGraduation += nextyear;
      } else {
        thisYearsGraduation += thisyear;
      }

      const eloConstant = 7;

      let totalwins;
      await pool.query(`SELECT sum(stats_w) FROM users WHERE info_graduation >= '${thisYearsGraduation}'::date`).then(({rows}) => {totalwins = parseInt(rows[0].sum)})
      let totallosses;
      await pool.query(`SELECT sum(stats_l) FROM users WHERE info_graduation >= '${thisYearsGraduation}'::date`).then(({rows}) => {totallosses = parseInt(rows[0].sum)})
      let avgwinpercent = 1;
      if(totalwins !== 0) {
        avgwinpercent = totalwins / (totalwins + totallosses)
      }
      await pool.query(`UPDATE users SET stats_elo = stats_w + ${eloConstant * avgwinpercent} / (stats_w + stats_l + ${eloConstant});`);
    
      await pool.query("WITH ranks (rank) AS ( SELECT RANK () OVER ( ORDER BY stats_elo DESC ) stats_rank FROM users ) UPDATE users SET stats_rank = rank FROM ranks;");
      
      await pool.end();
      return res.status(200).send();
    } catch (err){
      console.log(err);
      return res.status(500).send();
    }
  } else {
    return res.status(405).send();
  }
}