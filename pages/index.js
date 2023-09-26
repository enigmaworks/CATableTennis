import { withSessionSsr  } from "helpers/lib/config/withSession";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;
    if(user){
      return {props: { signedin: true, user: user }}
    } else {
      return {props: { signedin: false, user: null }}
    }
  }
);

export default function Home(props){
  return (<>
  <header>
    <h1>Caravel Academy Table Tennis Club</h1>
  </header>
  <section>
  </section>
  </>);
}