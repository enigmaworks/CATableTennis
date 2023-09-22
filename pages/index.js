import { withSessionSsr  } from "helpers/lib/config/withSession";

export default function Home(props){
  return (<>
    <h1>Login/Logout Functionality Demo</h1>
    <div>{ props.signedin ? `signed in as ${props.user.username}` : "not signed in" }</div>
    <ul>
      <li>
        <a href="/login">login page</a>
      </li>
      <li>
        <a href="/admin">admin page</a> (redirects if user is not signed in)
      </li>
      <li>
        <a href="/about">about page</a> 
      </li>
      <li>
        <button onClick={signout}>Sign Out</button>
      </li>
    </ul>
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