import {withSessionRoute} from "/helpers/withIronSession";

import pg from 'pg';
const bcrypt = require ('bcrypt');

export default withSessionRoute(create);

async function create(req, res){
  if(req.method = "POST"){
    const {username, password, permissions, info_first_name, info_last_name, info_graduation} = req.body;

    if(req.session && req.session.user) {
      try {
        if(req.session.user.permissions === 2){
          await createUser(username, password, permissions, info_first_name, info_last_name, info_graduation);
        } else {
          await createUser(username, password, 0, info_first_name, info_last_name, info_graduation);
        }
      } catch (err) {
        console.log(err);
        return res.status(500).send();
      }
      return res.status(200).send();
    } else {
      return res.status(401).send();
    }
  }
  return res.status(405).send();
}

async function createUser(username, password, permissions, info_first_name, info_last_name, info_graduation){
  const now = new Date().toISOString();
 
  let gradyear = "July 1 " + info_graduation;
  
  try {
    const pool = new pg.Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
    await bcrypt.hash(password, parseInt(process.env.ENCRYPTION_SALT_ROUNDS), async function(err, hash) { 
      const query = `
        INSERT INTO users(username, password, permissions, date_created, date_stats_updated, info_first_name, info_last_name, info_graduation, stats_w, stats_l, stats_elo, stats_rank)
        VALUES ('${username}', '${hash}', ${permissions}, '${now}', '${now}', '${info_first_name}', '${info_last_name}', '${gradyear}', 0, 0, 0, 0);`;
      if(err){
        throw err;
      } else {
        await pool.query(query).then(()=>{pool.end()});
      }
    })
  } catch (err) {
    throw err;
  }
}
