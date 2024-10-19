import {withSessionRoute} from "/helpers/withIronSession";
import pg from 'pg';
const bcrypt = require ('bcrypt');

export default withSessionRoute(edit);


async function edit(req, res){
  if(req.method = "POST"){
    if(req.session && req.session.user && req.session.user.permissions >= 1 && req.body.data !== undefined){
      try{
        const pool = new pg.Pool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          database: process.env.DB_DATABASE,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT,
        });
        const {id, data} = req.body;
        const updated_column = Object.keys(data);
        const characterDataColumns = ["info_first_name", "info_last_name", "date_stats_updated"];
        const numericalDataColumns = ["permissions", "stats_w", "stats_l", "stats_elo", "stats_rank"];

        await pool.query(`UPDATE users SET date_stats_updated = '${new Date().toISOString()}' WHERE id = ${id};`);

        for(let i = 0; i < updated_column.length; i++){
          if(characterDataColumns.includes(updated_column[i])){
            await pool.query(`UPDATE users SET ${updated_column[i]} = '${data[updated_column[i]]}' WHERE id = ${id};`);
          } else if (numericalDataColumns.includes(updated_column[i])) {
            await pool.query(`UPDATE users SET ${updated_column[i]} = ${data[updated_column[i]]} WHERE id = ${id};`);
          }
        }
        if(updated_column.includes("info_graduation")){
          await pool.query(`UPDATE users SET info_graduation = '${"July 1 " + data["info_graduation"]}'::date WHERE id = ${id};`);
        }
        if (updated_column.includes("password")){
          let password = data.password;
          console.log(password);
          await bcrypt.hash(password, parseInt(process.env.ENCRYPTION_SALT_ROUNDS), async function(err, hash) {
            if(err){
              console.log(err)
              await pool.end();
              return res.status(500).send();
            } else{
              await pool.query(`UPDATE users SET password = '${hash}' WHERE id = ${id};`).then(()=>{pool.end()});
              return res.status(200).send();
            }
          });
        } else{
          await pool.end();
          return res.status(200).send();
        }
      } catch (err) {
        console.log(err)
        return res.status(500).send();
      }
    } else {
      if(req.session.user.id === req.body.id && toString(req.body.old_password) !== "" && toString(req.body.new_password) !== ""){
        try{
          const pool = new pg.Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
          });
          const {rows} = await pool.query(`SELECT password FROM users WHERE id = '${req.session.user.id}';`);
          const {password: hashed} = rows[0];
          
          await bcrypt.compare(req.body.old_password, hashed, async function (err, result) {
            if(result === true) {
              await bcrypt.hash(req.body.new_password, parseInt(process.env.ENCRYPTION_SALT_ROUNDS), async function(err, hash) {
                if(err){
                  console.log(err)
                  await pool.end();
                  return res.status(500).send();
                } else{
                  await pool.query(`UPDATE users SET password = '${hash}' WHERE id = '${req.session.user.id}';`).then(()=>{pool.end()});
                  return res.status(200).send();
                }
              });
            } else if (err) {
              console.log(err);
              await pool.end();
              return res.status(500).send();
            } else if (result === false) {
              await pool.end();
              return res.status(401).send();
            }
          });
        } catch (err){
          console.log(err);
          return res.status(500).send();
        }
      }
    }
  } else {
    return res.status(405).send();
  }
}