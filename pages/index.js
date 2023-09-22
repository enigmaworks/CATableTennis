import { withSessionSsr  } from "helpers/lib/config/withSession";

export default function Home(props){
  return (<>
  <header>
    <h1>Caravel Academy Table Tennis Club</h1>
  </header>
  <section>
    <div>{ props.signedin ? `signed in as ${props.user.username}` : "not signed in" }</div>
    <ul>
      <li>
        <a href="/login">login page</a>
      </li>
      <li>
        <button onClick={signout}>Sign Out</button>
      </li>
    </ul>

  </section>
  </>);
}

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;

    if(!user){
      return {
        props: { signedin: false }
      }
    }

    return { props: { signedin: true, user: user } }
  }
)

function signout(){
  fetch("./api/logout").then(()=>{
    location.reload(true);
  })
}