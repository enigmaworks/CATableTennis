import { withSessionSsr  } from "/helpers/withIronSession";
import styles from "/styles/practice.module.css";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {

    if(req.session && req.session.user){
      return {props: { signedin: true, user: req.session.user}}
    } else {
      return {props: { signedin: false, user: null}}
    }
  }
);

export default function practice(props) {

}