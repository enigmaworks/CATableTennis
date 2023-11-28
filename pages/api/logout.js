import { withSessionRoute } from "helpers/withSession";

export default withSessionRoute(logout);

async function logout(req, res) {
  req.session.destroy();
  return res.status(200).send();
}