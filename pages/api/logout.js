import { withSessionRoute } from "helpers/lib/config/withSession";

export default withSessionRoute(logout);

async function logout(req, res) {
  req.session.destroy();
  return res.status(200).send();
}