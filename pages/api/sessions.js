import {withSessionRoute} from "/helpers/withIronSession";
const bcrypt = require('bcrypt');
import pg from 'pg';

export default withSessionRoute(createSessionRoute);

async function createSessionRoute(req, res){
  if(req.method === "POST"){
    const {username, password} = req.body;

    if(process.env.NODE_ENV === "development"){
      if (username === "superadmin" && password === "password"){
        req.session.user = {
            username: "superadmin",
            id: 0,
            permissions: 2,
            info_first_name: "Super",
            info_last_name: "Admin",
        };
        await req.session.save();
        return res.status(200).send();
      } else if (username === "admin" && password === "password"){
        req.session.user = {
            username: "admin",
            id: 0,
            permissions: 1,
            info_first_name: "Standard",
            info_last_name: "Admin",
        };
        await req.session.save();
        return res.status(200).send();
      } else if (username === "user" && password === "password"){
        req.session.user = {
            username: "user",
            id: 0,
            permissions: 0,
            info_first_name: "User",
            info_last_name: "Testuser",
        };
        await req.session.save();
        return res.status(200).send();
      }
    }

    try{
      const pool = new pg.Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      });

      const {rows} = await pool.query(`SELECT password, id, permissions, info_first_name, info_last_name FROM users WHERE username = '${username}';`);
      const user = rows[0];
      let hashed = user.password;

      await pool.end();
      await bcrypt.compare(password, hashed, async function (err, result) {
        if(result === true) {
          req.session.user = {
            username: username,
            id: user.id,
            permissions: user.permissions,
            info_first_name: user.info_first_name,
            info_last_name: user.info_last_name,
          };
          
          await req.session.save();
          res.status(200).send();
        } else if (err) {
          console.log(err);
          res.status(500).send();
        } else if (result === false) {
          res.status(401).send();
        }
      });
    } catch (err){
      console.log(err);
      res.status(500).send();
    }
  } else { return res.status(405).send(); }
}