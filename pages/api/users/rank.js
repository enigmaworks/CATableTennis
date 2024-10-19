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
      //get the required information to determine if it necessary to re rank the leaderboard
      
      let {rows} = await pool.query('SELECT last_leaderboard_update, leaderboard_update_frequency FROM site_info;')
      const lastupdate = new Date(rows[0].last_leaderboard_update);

      //convert the update frquency, stored in days, to milliseconds
      const frequency = rows[0].leaderboard_update_frequency * 86400000;

      //figure out when the next scheduled update is
      const nextupdate = new Date(lastupdate.getTime() + frequency);
      const now = new Date();

      if(now.getTime() < nextupdate.getTime() && !(req.body.force && req.session && req.session.user && req.session.user.permissions === 2)){
        // no need to rank
        return res.status(304).send();
      } else {
        // figure when the upcoming graduation is, to filter out alumni
        const thisyear = now.getFullYear();
        const nextyear = thisyear + 1;
        let thisYearsGraduation = "July 1 ";
        if(new Date().getMonth() > 6){ 
          thisYearsGraduation += nextyear;
        } else {
          thisYearsGraduation += thisyear;
        }

        //calculate total wins, total losses, and average win percent among the playerbase
        let totalwins;
        await pool.query(`SELECT sum(stats_w) FROM users WHERE info_graduation >= '${thisYearsGraduation}'::date`).then(({rows}) => {totalwins = parseInt(rows[0].sum)})
        
        let totallosses;
        await pool.query(`SELECT sum(stats_l) FROM users WHERE info_graduation >= '${thisYearsGraduation}'::date`).then(({rows}) => {totallosses = parseInt(rows[0].sum)})
        
        let avgwinpercent = 1;
        if(totalwins !== 0) {
          avgwinpercent = totalwins / (totalwins + totallosses)
        }

        // calculate the elo for each current player using  
        // elo = (wins + c * win%) / (wins + losses + c)
        // where c is a constant determining how much to weight the average win percent compared to the player record
        const eloConstant = 7;
        await pool.query(`UPDATE users SET stats_elo = stats_w + ${eloConstant * avgwinpercent} / (stats_w + stats_l + ${eloConstant});`);
      
        //update the rankings of current players using the new elo values
        await pool.query(`
          WITH cte (id, rank) AS (
            SELECT id,
            RANK () OVER (
              ORDER BY stats_elo DESC
            ) FROM users WHERE info_graduation >= 'July 1 2024'::DATE
          )
          UPDATE users SET stats_rank = cte.rank FROM cte WHERE users.id = cte.id;
        `
        );

        await pool.end();
        return res.status(200).send();
      }
    } catch (err){
      console.log(err);
      return res.status(500).send();
    }
  } else {
    return res.status(405).send();
  }
}