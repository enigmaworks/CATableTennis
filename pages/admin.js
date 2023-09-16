import { withSessionSsr  } from "./lib/config/withSession";

export default function Admin(props){
  return (
    <>
      <h1>logged in as {props.user.username}</h1>
      <a href="/logout">logout</a>
    </>
  );
}

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;

    if(!user){
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        }
    }

    }

    return { props: { user } }
  }
)