import { withSessionSsr  } from "./lib/config/withSession";

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

    return { props: {user: user } }
  }
)

export default function Admin(props){
  return (
    <>
      <h1>Admin Page!</h1>
      <div> logged in as <b>{props.user.username}</b></div>
      <div>
        <a href="/">home</a>
      </div>
    </>
  );
}