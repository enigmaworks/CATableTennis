import {withSessionRoute} from "pages/lib/config/withSession";

const TEST_USERNAME = "testuser";
const TEST_PASSWORD = "password";

export default withSessionRoute(createSessionRoute);

async function createSessionRoute(req, res){
  if(req.method === "POST"){
    const {username, password} = req.body;

    if(user === TEST_USERNAME && password === TEST_PASSWORD){
      req.session.user = {
        username: username,
        permisions: 0,
      };
      await req.session.save();
      res.send({ok:true});
    }

    return res.status(403).send("");
  }

  return res.status(404).send("");
}