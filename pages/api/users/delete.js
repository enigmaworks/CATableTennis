import {withSessionRoute} from "/helpers/withIronSession";
import pg from 'pg';

export default withSessionRoute(_delete);

async function _delete(req, res){
  if(req.method = "POST"){
    if(req.session && req.session.user && req.session.user.permissions === 2) {
      let id = parseInt(req.body.id);
      try{
        const pool = new pg.Pool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          database: process.env.DB_DATABASE,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT,
        });

        await pool.query(`DELETE FROM users WHERE ${id} = id;`);
        await pool.end();
        return res.status(200).send();
      } catch (err){
        console.log(err);
        return res.status(500).send();
      }
    } else {
      return res.status(401).send();
    }
  }
  return res.status(405).send();
}